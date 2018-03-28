package umm3601.resource;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;
import umm3601.resource.ResourceController;

public class ResourceRequestHandler {
    private final ResourceController resourceController;
    public ResourceRequestHandler(ResourceController resourceController){
        this.resourceController = resourceController;
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
    public String addNewResouce(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            // if the object that is the JSON representation of the request body's class is the class BasicDBObject
            // then try to add the item with itemController's addNewItem method
            if(o.getClass().equals(BasicDBObject.class)) {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String resourceName = dbO.getString("resourceName");
                    String resourceBody = dbO.getString("resourceBody");
                    String resourcePhone = dbO.getString("resourcePhone");
                    String resourceUrl = dbO.getString("resourceUrl");

                    return resourceController.addNewResource(resourceName, resourceBody,resourcePhone, resourceUrl).toString();
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

    public String editResource(Request req, Response res)
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
                    String resourceName = dbO.getString("resourceName");
                    String resourceBody = dbO.getString("resourceBody");
                    String resourcePhone = dbO.getString("resourcePhone");
                    String resourceUrl = dbO.getString("resourceUrl");


                    return resourceController.editGoal(id, resourceName, resourceBody, resourcePhone, resourceUrl).toString();
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

    public String deleteResource(Request req, Response res){

        System.out.println("I'm here");
        System.out.println(req.params(":id"));

        res.type("application/json");

        try {
            String id = req.params(":id");
            resourceController.deleteResouce(id);
            return req.params(":id");
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return null;
        }
    }

}
