package umm3601.resources;
import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;

public class ResourceRequestHandler {
    private final ResourceController resourceController;
    public ResourceRequestHandler(ResourceController resourceController){
        this.resourceController = resourceController;
    }
    /**Method called from Server when the 'api/items/:id' endpoint is received.
     * Get a JSON response with a list of all the users in the database.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one user in JSON formatted string and if it fails it will return text with a different HTTP status code
     */
    public String getGoalJSON(Request req, Response res) {
        res.type("application/json");
        String id = req.params("id");
        String item;
        try {
            item = resourceController.getresources(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested item id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (item != null) {
            return item;
        } else {
            res.status(404);
            res.body("The requested item with id " + id + " was not found");
            return "";
        }
    }


