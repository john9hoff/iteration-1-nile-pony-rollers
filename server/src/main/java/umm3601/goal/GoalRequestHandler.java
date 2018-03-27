package umm3601.goal;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;
import umm3601.goal.GoalController;

public class GoalRequestHandler {
    private final GoalController goalController;
    public GoalRequestHandler(GoalController goalController){
        this.goalController = goalController;
    }
    /**Method called from Server when the 'api/items/:id' endpoint is received.
     * Get a JSON response with a list of all the users in the database.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one user in JSON formatted string and if it fails it will return text with a different HTTP status code
     */

    // gets one item using its ObjectId--didn't use, just for potential future functionality
    public String getGoalJSON(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String item;
        try {
            item = goalController.getGoal(id);
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
    public String getGoals(Request req, Response res)
    {
        res.type("application/json");
        return goalController.getGoals(req.queryMap().toMap());
    }

    /**Method called from Server when the 'api/users/new'endpoint is received.
     * Gets specified user info from request and calls addNewUser helper method
     * to append that info to a document
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return a boolean as whether the user was added successfully or not
     */
    public String addNewGoal(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            // if the object that is the JSON representation of the request body's class is the class BasicDBObject
            // then try to add the item with itemController's addNewItem method
            if(o.getClass().equals(BasicDBObject.class)) {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String purpose = dbO.getString("purpose");
                    String category = dbO.getString("category");
                    String name = dbO.getString("name");
                    Boolean status = dbO.getBoolean("status");

                    System.err.println("Adding new goal [purpose=" + purpose + ", category=" + category + " name=" + name + " status=" + status + ']');
                    return goalController.addNewGoal(purpose, category, name, status).toString();
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

    public String editGoal(Request req, Response res)
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
                    Boolean status = dbO.getBoolean("status");

                    System.err.println("Editing goal [purpose=" + purpose + ", category=" + category + ", name=" + name + ", status=" + status + ']');
                    return goalController.editGoal(id, purpose, category, name, status).toString();
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

    public String deleteGoal(Request req, Response res){

        System.out.println("I'm here");
        System.out.println(req.params(":id"));

        res.type("application/json");

        try {
            String id = req.params(":id");
            goalController.deleteGoal(id);
            return req.params(":id");
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return null;
        }
    }

}
