package umm3601;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
import spark.Request;
import spark.Response;
import umm3601.report.ReportController;
import umm3601.report.ReportRequestHandler;
import umm3601.resource.ResourceController;
import umm3601.resource.ResourceRequestHandler;
import umm3601.user.UserController;
import umm3601.user.UserRequestHandler;
import umm3601.tracker.TrackerController;
import umm3601.tracker.TrackerRequestHandler;
import umm3601.journal.JournalController;
import umm3601.journal.JournalRequestHandler;
import umm3601.goal.GoalController;
import umm3601.goal.GoalRequestHandler;
import java.io.IOException;


import static spark.Spark.*;
import static spark.debug.DebugScreen.enableDebugScreen;

public class Server {
    private static final String userDatabaseName = "dev";
    private static final String trackerDatabaseName = "dev";
    private static final String journalDatabaseName = "dev";
    private static final String goalDatabaseName = "dev";
    private static final String reportDatabaseName = "dev";
    private static final String resourceDatabaseName = "dev";

    private static final int serverPort = 4567;

    public static void main(String[] args) throws IOException {

        MongoClient mongoClient = new MongoClient();
        MongoDatabase userDatabase = mongoClient.getDatabase(userDatabaseName);
        MongoDatabase trackerDatabase = mongoClient.getDatabase(trackerDatabaseName);
        MongoDatabase journalDatabase = mongoClient.getDatabase(journalDatabaseName);
        MongoDatabase goalDatabase = mongoClient.getDatabase(goalDatabaseName);
        MongoDatabase reportDatabase = mongoClient.getDatabase(reportDatabaseName);
        MongoDatabase resourceDatabase = mongoClient.getDatabase(resourceDatabaseName);

        UserController userController = new UserController(userDatabase);
        UserRequestHandler userRequestHandler = new UserRequestHandler(userController);

        TrackerController trackerController = new TrackerController(trackerDatabase);
        TrackerRequestHandler trackerRequestHandler = new TrackerRequestHandler(trackerController);

        JournalController journalController = new JournalController(journalDatabase);
        JournalRequestHandler journalRequestHandler = new JournalRequestHandler(journalController);

        GoalController goalController = new GoalController(goalDatabase);
        GoalRequestHandler goalRequestHandler = new GoalRequestHandler(goalController);

        ReportController reportController = new ReportController(reportDatabase);
        ReportRequestHandler reportRequestHandler = new ReportRequestHandler(reportController);

        ResourceController resourceController = new ResourceController(resourceDatabase);
        ResourceRequestHandler resourceRequestHandler = new ResourceRequestHandler(resourceController);

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
        /// Report Endpoints ///////////////////////////
        /////////////////////////////////////////////

        get("api/reports", reportRequestHandler::getReports);
        get("api/reports/:id", reportRequestHandler::getReportJSON);

        /// Goal Endpoints ///////////////////////////
        /////////////////////////////////////////////

        get("api/goals", goalRequestHandler::getGoals);
        get("api/goals/:id", goalRequestHandler::getGoalJSON);
        post("api/goals/new", goalRequestHandler::addNewGoal);
        post("api/goals/edit", goalRequestHandler::editGoal);
        delete("api/goals/delete/:id", goalRequestHandler::deleteGoal);

        /// Resource Endpoints ///////////////////////////
        ////////////////////////////////////////////

        get("api/resources", resourceRequestHandler::getResources);
        post("api/goals/new", resourceRequestHandler::addNewResouce);
        post("api/goals/edit", resourceRequestHandler::editResource);
        delete("api/goals/delete/:id", resourceRequestHandler::deleteResource);

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
