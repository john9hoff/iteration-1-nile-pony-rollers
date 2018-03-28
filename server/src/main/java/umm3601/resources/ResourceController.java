package umm3601.resources;

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

    public String getresource(String name) {
        FindIterable<Document> jsonItems
            = resourceCollection
            .find(eq("resourceName", new ObjectId(name)));

        Iterator<Document> iterator = jsonItems.iterator();
        if (iterator.hasNext()) {
            Document resource = iterator.next();
            return resource.toJson();
        } else {
            // We didn't find the desired item
            return null;
        }
    }

    public String getresources(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();

        // "goal" will be a key to a string object, where the object is
        // what we get when people enter their goals as a text body.
        // "goal" is the purpose of the goal
        if (queryParams.containsKey("resourceBody")) {
            String targetContent = (queryParams.get("resourceBody")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("resourceBody", contentRegQuery);
        }

        // category is the category of the goal, also a String
        if (queryParams.containsKey("resourcePhone")) {
            String targetContent = (queryParams.get("resourcePhone")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("resourcePhone", contentRegQuery);
        }

        // name is the title of the goal
        if (queryParams.containsKey("resourcesUrl")) {
            String targetContent = (queryParams.get("resourcesUrl")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("resourcesUrl", contentRegQuery);
        }
        // FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingResources = resourceCollection.find(filterDoc);

        return JSON.serialize(matchingResources);
    }

    /**
     * Helper method which appends received user information to the to-be added document
     *
     * @param resourceBody
     * @param resourcePhone
     * @param resourcesUrl
     * @return boolean after successfully or unsuccessfully adding a user
     */
    // As of now this only adds the goal, but you can separate multiple arguments
    // by commas as we add them.
    public String addNewResource(String resourceBody, String resourcePhone, String resourcesUrl) {

        // makes the search Document key-pairs
        Document newResources = new Document();
        newResources.append("resourceBody", resourceBody);
        newResources.append("resourcePhone", resourcePhone);
        newResources.append("resourcesUrl", resourcesUrl);
        // Append new goals here

        try {
            resourceCollection.insertOne(newResources);
            ObjectId name = newResources.getObjectId("resourceName");

            System.err.println("Successfully added new Resources [resourceName=" + name + ", resourceBody=" + resourceBody + ", resourcePhone=" + resourcePhone + ", resourcesUrl=" + resourcesUrl + ']');
            //return id.toHexString();
            return JSON.serialize(name);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

    public String editResources(String name, String body, String phone, String url){
        System.out.println("Right here again");
        Document newResources = new Document();
        newResources.append("resourceBody", body);
        newResources.append("resourcePhone", phone);
        newResources.append("resourceUrl", url);
        Document setQuery = new Document();
        setQuery.append("$set", newResources);

        Document searchQuery = new Document().append("resourceName", new ObjectId(name));

        System.out.println(name);

        try {
            resourceCollection.updateOne(searchQuery, setQuery);
            ObjectId name1 = searchQuery.getObjectId("resourceName");
            System.err.println("Successfully updated resource [resourceName=" + name1 + ", resourceBody=" + body +
                ", resourcePhone=" + phone + ", resourceUrl=" + url + ']');
            return JSON.serialize(name1);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

    public void deleteresources(String name){
        Document searchQuery = new Document().append("resourceName", new ObjectId(name));

        try {
            resourceCollection.deleteOne(searchQuery);
            ObjectId name1 = searchQuery.getObjectId("resourceName");
            System.out.println("Succesfully deleted resource " + name1);

        } catch(MongoException me) {
            me.printStackTrace();
            System.out.println("error");
        }
    }
}
