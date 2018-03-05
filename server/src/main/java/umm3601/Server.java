package umm3601;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
import spark.Request;
import spark.Response;
import umm3601.user.UserController;
import umm3601.user.UserRequestHandler;
import umm3601.tracker.TrackerController;
import umm3601.tracker.TrackerRequestHandler;
import umm3601.journal.JournalController;
import umm3601.journal.JournalRequestHandler;

import java.io.IOException;


import static spark.Spark.*;
import static spark.debug.DebugScreen.enableDebugScreen;

public class Server {
    private static final String userDatabaseName = "dev";
    private static final String trackerDatabaseName = "dev";
    private static final String journalDatabaseName = "dev";

    private static final int serverPort = 4567;

    public static void main(String[] args) throws IOException {

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

        redirect.get("/", "http://localhost:9000");

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
