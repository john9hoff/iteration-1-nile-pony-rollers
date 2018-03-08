package umm3601.tracker;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;
import java.util.Date;

/**
 * Created by Brian on 11/29/2017.
 */
public class TrackerRequestHandler {

    private final TrackerController trackerController;
    public TrackerRequestHandler(TrackerController trackerController){
        this.trackerController = trackerController;
    }
    /**Method called from Server when the 'api/trackers/:id' endpoint is received.
     * Get a JSON response with a list of all the trackers in the database.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one tracker in JSON formatted string and if it fails it will return text with a different HTTP status code
     */
    public String getTrackerJSON(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String tracker;
        try {
            tracker = trackerController.getTracker(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested tracker id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (tracker != null) {
            return tracker;
        } else {
            res.status(404);
            res.body("The requested tracker with id " + id + " was not found");
            return "";
        }
    }



    /**Method called from Server when the 'api/trackers' endpoint is received.
     * This handles the request received and the response
     * that will be sent back.
     *@param req the HTTP request
     * @param res the HTTP response
     * @return an array of trackers in JSON formatted String
     */
    public String getTrackers(Request req, Response res)
    {
        res.type("application/json");
        return trackerController.getTrackers(req.queryMap().toMap());
    }


    /**Method called from Server when the 'api/trackers/new'endpoint is recieved.
     * Gets specified tracker info from request and calls addNewTracker helper method
     * to append that info to a document
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return a boolean as whether the tracker was added successfully or not
     */
    public String addNewTracker(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String emoji = dbO.getString("emoji");
                    //For some reason age is a string right now, caused by angular.
                    //This is a problem and should not be this way but here ya go
                    String date = dbO.getString("date");

                    System.err.println("Adding new tracker [emoji=" + emoji + ", date=" + date.toString() + ']');
                    return trackerController.addNewTracker(emoji).toString();
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new tracker request failed.");
                    return null;
                }

            }
            else
            {
                System.err.println("Expected BasicDBObject, received " + o.getClass());
                return null;
            }
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return null;
        }
    }
}
