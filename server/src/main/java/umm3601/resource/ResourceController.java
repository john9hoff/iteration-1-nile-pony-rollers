package umm3601.resource;

import com.google.gson.Gson;
import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;


// Controller that manages information about people's items.
public class ResourceController {

    private final Gson gson;
    private MongoDatabase database;
    // goalCollection is the collection that the goals data is in.
    private final MongoCollection<Document> resourceCollection;

    // Construct controller for items.
    public ResourceController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        resourceCollection = database.getCollection("resources");
    }

    // get a goal by its ObjectId, not used by client, for potential future use
    public String getResource(String id) {
        FindIterable<Document> jsonItems
            = resourceCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonItems.iterator();
        if (iterator.hasNext()) {
            Document goal = iterator.next();
            return goal.toJson();
        } else {
            // We didn't find the desired item
            return null;
        }
    }

    // Helper method which iterates through the collection, receiving all
    // documents if no query parameter is specified. If the goal parameter is
    // specified, then the collection is filtered so only documents of that
    // specified goal are found.
    public String getResources(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();


        // FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingResources = resourceCollection.find(filterDoc);

        return JSON.serialize(matchingResources);
    }

    /**
     * Helper method which appends received user information to the to-be added document
     *
     * @param
     * @param
     * @param
     * @return boolean after successfully or unsuccessfully adding a user
     */
    // As of now this only adds the goal, but you can separate multiple arguments
    // by commas as we add them.
    public String addNewResource(String resourceName, String resourceBody, String resourcePhone, String resourceUrl) {

        // makes the search Document key-pairs
        Document newResource = new Document();
        newResource.append("resourceName", resourceName);
        newResource.append("resourceBody", resourceBody);
        newResource.append("resourcePhone", resourcePhone);
        newResource.append("resourceUrl", resourceUrl);
        // Append new goals here

        try {
            resourceCollection.insertOne(newResource);
            ObjectId id = newResource.getObjectId("_id");

            System.err.println("Successfully added new goal");
            //return id.toHexString();
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

    public String editGoal(String id, String resourceName, String resourceBody, String resourcePhone, String resourceUrl){
        System.out.println("Right here again");
        Document newResource = new Document();
        newResource.append("resourceName", resourceName);
        newResource.append("resourceBody", resourceBody);
        newResource.append("resourcePhone", resourcePhone);
        newResource.append("resourceUrl", resourceUrl);
        Document setQuery = new Document();
        setQuery.append("$set", newResource);

        Document searchQuery = new Document().append("_id", new ObjectId(id));

        System.out.println(id);

        try {
            resourceCollection.updateOne(searchQuery, setQuery);
            ObjectId id1 = searchQuery.getObjectId("_id");
          System.out.println("resource added");
            return JSON.serialize(id1);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

    public void deleteResouce(String id){
        Document searchQuery = new Document().append("_id", new ObjectId(id));

        try {
            resourceCollection.deleteOne(searchQuery);
            ObjectId id1 = searchQuery.getObjectId("_id");
            System.out.println("Succesfully deleted resource " + id1);

        } catch(MongoException me) {
            me.printStackTrace();
            System.out.println("error");
        }
    }

}
