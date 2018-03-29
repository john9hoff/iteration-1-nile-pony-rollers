package umm3601.resources;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;
import umm3601.resources.ResourceController;


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

    // gets one item using its ObjectId--didn't use, just for potential future functionality
    public String getResourcesJSON(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String item;
        try {
            item = resourceController.getResource(id);
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



    /**Method called from Server when the 'api/items' endpoint is received.
     * This handles the request received and the response
     * that will be sent back.
     *@param req the HTTP request
     * @param res the HTTP response
     * @return an array of users in JSON formatted String
     */

    // Gets the goals from the DB given the query parameters
    public String getResources(Request req, Response res)
    {
        res.type("application/json");
        return resourceController.getResources(req.queryMap().toMap());
    }

    /**Method called from Server when the 'api/users/new'endpoint is received.
     * Gets specified user info from request and calls addNewUser helper method
     * to append that info to a document
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return a boolean as whether the user was added successfully or not
     */
    public String addNewResource(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class)) {
                try {
                    System.out.println("sdfsdfsdfsdfsdzfsdfsd");
                    BasicDBObject dbO = (BasicDBObject) o;

                    String purpose = dbO.getString("purpose");
                    String category = dbO.getString("category");
                    String name = dbO.getString("name");
                    String phone = dbO.getString("phone");


                    System.err.println("Adding new resource [purpose=" + purpose + ", category=" + category + " name=" + name + " phone=" + phone +']');
                    return resourceController.addNewResource(purpose, category, name, phone).toString();
                } catch (NullPointerException e) {
                    System.err.println("A value was malformed or omitted, new item request failed.");
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

    public String editResources(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            // if the object that is the JSON representation of the request body's class is the class BasicDBObject
            // then try to add the item with itemController's editGoal method
            if(o.getClass().equals(BasicDBObject.class)) {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String id = dbO.getString("_id");
                    String purpose = dbO.getString("purpose");
                    String category = dbO.getString("category");
                    String name = dbO.getString("name");
                    String phone = dbO.getString("phone");

                    System.err.println("Editing Resource [purpose=" + purpose + ", category=" + category + ", name=" + name + ", phone=" + phone + ']');
                    return resourceController.editResources(id, purpose, category, name, phone).toString();
                } catch (NullPointerException e) {
                    System.err.println("A value was malformed or omitted, new item request failed.");
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

    public String deleteResources(Request req, Response res){

        System.out.println("I'm here");
        System.out.println(req.params(":id"));

        res.type("application/json");

        try {
            String id = req.params(":id");
            resourceController.deleteResources(id);
            return req.params(":id");
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return null;
        }
    }

}

