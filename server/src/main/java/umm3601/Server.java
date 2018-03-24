package umm3601;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import spark.Request;
import spark.Response;
import spark.Route;
import umm3601.user.UserController;
import umm3601.user.UserRequestHandler;
import umm3601.tracker.TrackerController;
import umm3601.tracker.TrackerRequestHandler;
import umm3601.journal.JournalController;
import umm3601.journal.JournalRequestHandler;
import umm3601.Authentication.*;

import java.io.*;
import java.nio.file.Paths;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.Map;
import java.util.Properties;

import javax.servlet.MultipartConfigElement;
import javax.servlet.http.Part;

import java.io.IOException;


import static spark.Spark.*;
import static spark.debug.DebugScreen.enableDebugScreen;

public class Server {
    private static final String userDatabaseName = "dev";
    private static final String trackerDatabaseName = "dev";
    private static final String journalDatabaseName = "dev";
    private static String clientId;
    private static String clientSecret;
    private static  String publicURL;
    private static String callbackURL;

    private static final int serverPort = 4567;

    public static void main(String[] args) throws IOException, NoSuchAlgorithmException {

        MongoClient mongoClient = new MongoClient();
        MongoDatabase userDatabase = mongoClient.getDatabase(userDatabaseName);
        MongoDatabase trackerDatabase = mongoClient.getDatabase(trackerDatabaseName);
        MongoDatabase journalDatabase = mongoClient.getDatabase(journalDatabaseName);

        UserController userController = new UserController(userDatabase);
        UserRequestHandler userRequestHandler = new UserRequestHandler(userController);

        TrackerController trackerController = new TrackerController(trackerDatabase);
        TrackerRequestHandler trackerRequestHandler = new TrackerRequestHandler(trackerController);

        JournalController journalController = new JournalController(journalDatabase);
        JournalRequestHandler journalRequestHandler = new JournalRequestHandler(journalController);

        //Configure Spark
        port(serverPort);
        enableDebugScreen();

        // Specify where assets like images will be "stored"
        staticFiles.location("/public");

        Auth auth = new Auth(clientId, clientSecret, callbackURL);

        options("/*", (request, response) -> {

            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));


        // Simple example route
        get("/hello", (req, res) -> "Hello World");

        // Redirects for the "home" page
        redirect.get("", "/");

        Route notFoundRoute = (req, res) -> {
            res.type("text");
            res.status(404);
            return "Sorry, we couldn't find that!";
        };

        get("callback", (req, res) ->{
            Map<String, String[]> params = req.queryMap().toMap();
            String[] states = params.get("state");
            String[] codes = params.get("code");
            String[] errors = params.get("error");
            if (null == states) {
                // we REQUIRE that we be passed a state
                halt(400);
                return ""; // never reached
            }
            if (null == codes ) {
                if (null == errors) {
                    // we don't have codes, but we don't have an error either, so this a garbage request
                    halt(400);
                    return ""; // never reached
                }
                else if ("access_denied".equals(errors[0])) {
                    // the user clicked "deny", so send them to the visitor page
                    res.redirect(publicURL);
                    return ""; // send an empty body back on redirect
                }
                else {
                    // an unknown error was passed to us, so we halt
                    halt(400);
                    return ""; // not reached
                }
            }
            String state = states[0];
            String code = codes[0];
            try {
                String originatingURL = auth.verifyCallBack(state, code);
                if (null != originatingURL) {
                    Cookie c = auth.getCookie();
                    res.cookie(c.name, c.value, c.max_age);
                    res.redirect(originatingURL);
                    System.out.println("good");
                    return ""; // not reached
                } else {
                    System.out.println("bad");
                    res.status(403);
                    return "?????";
                }
            } catch (UnauthorizedUserException e) {
                res.redirect(publicURL + "/admin/incorrectAccount");
                return ""; // not reached
            } catch (ExpiredTokenException e) {
                // send the user to a page to tell them to login faster
                res.redirect(publicURL + "/admin/slowLogin");
                return ""; // send empty body on redirect
            }
        });

        get("api/check-authorization", (req, res) -> {
            res.type("application/json");
            res.header("Cache-Control","no-cache, no-store, must-revalidate");
            String cookie = req.cookie("ddg");
            Document returnDoc = new Document();
            returnDoc.append("authorized", auth.authorized(cookie));
            return JSON.serialize(returnDoc);
        });

        get("api/authorize", (req,res) -> {
            String originatingURLs[] = req.queryMap().toMap().get("originatingURL");
            String originatingURL;
            if (originatingURLs == null) {
                originatingURL = publicURL;
            } else {
                originatingURL = originatingURLs[0];
            }
            res.redirect(auth.getAuthURL(originatingURL));
            // I think we could return an arbitrary value since the redirect prevents this from being used
            return res;
        });

        /// User Endpoints ///////////////////////////
        /////////////////////////////////////////////

        //List users, filtered using query parameters

        get("api/users", userRequestHandler::getUsers);
        get("api/users/:id", userRequestHandler::getUserJSON);
        post("api/users/new", userRequestHandler::addNewUser);

        /// Tracker Endpoints ///////////////////////////
        /////////////////////////////////////////////

        get("api/trackers", trackerRequestHandler::getTrackers);
        get("api/trackers/:id", trackerRequestHandler::getTrackerJSON);
        post("api/trackers/new", trackerRequestHandler::addNewTracker);

        /// Journal Endpoints ///////////////////////////
        /////////////////////////////////////////////

        get("api/journals", journalRequestHandler::getJournals);
        get("api/journals/:id", journalRequestHandler::getJournalJSON);
        post("api/journals/new", journalRequestHandler::addNewJournal);
        post("api/journals/edit", journalRequestHandler::editJournal);

        // An example of throwing an unhandled exception so you can see how the
        // Java Spark debugger displays errors like this.
        get("api/error", (req, res) -> {
            throw new RuntimeException("A demonstration error");
        });

        // Called after each request to insert the GZIP header into the response.
        // This causes the response to be compressed _if_ the client specified
        // in their request that they can accept compressed responses.
        // There's a similar "before" method that can be used to modify requests
        // before they they're processed by things like `get`.
        after("*", Server::addGzipHeader);

        // Handle "404" file not found requests:
        notFound((req, res) -> {
            res.type("text");
            res.status(404);
            return "Sorry, we couldn't find that!";
        });
    }

    // Enable GZIP for all responses
    private static void addGzipHeader(Request request, Response response) {
        response.header("Content-Encoding", "gzip");
    }
}
