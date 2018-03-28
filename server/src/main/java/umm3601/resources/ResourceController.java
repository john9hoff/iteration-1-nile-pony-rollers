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

    public String getResource(String name) {
        FindIterable<Document> jsonItems
            = resourceCollection
            .find(eq("_id", new ObjectId(name)));

        Iterator<Document> iterator = jsonItems.iterator();
        if (iterator.hasNext()) {
            Document resource = iterator.next();
            return resource.toJson();
        } else {
            // We didn't find the desired item
            return null;
        }
    }

    public String getResources(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();

        // "goal" will be a key to a string object, where the object is
        // what we get when people enter their goals as a text body.
        // "goal" is the purpose of the goal
        if (queryParams.containsKey("purpose")) {
            String targetContent = (queryParams.get("purpose")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("purpsoe", contentRegQuery);
        }

        // category is the category of the goal, also a String
        if (queryParams.containsKey("category")) {
            String targetContent = (queryParams.get("category")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("category", contentRegQuery);
        }

        // name is the title of the goal
        if (queryParams.containsKey("name")) {
            String targetContent = (queryParams.get("name")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("name", contentRegQuery);
        }

        if (queryParams.containsKey("phone")) {
            String targetContent = (queryParams.get("phone")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("phone", contentRegQuery);
        }

        // FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingResources = resourceCollection.find(filterDoc);

        return JSON.serialize(matchingResources);
    }

    /**
     * Helper method which appends received user information to the to-be added document
     *
     * @param purpose
     * @param category
     * @param name
     * @param phone
     * @return boolean after successfully or unsuccessfully adding a user
     */
    // As of now this only adds the goal, but you can separate multiple arguments
    // by commas as we add them.
    public String addNewResource(String purpose, String category, String name, String phone) {

        // makes the search Document key-pairs
        Document newResources = new Document();
        newResources.append("purpsoe", purpose);
        newResources.append("category", category);
        newResources.append("name", name);
        newResources.append("phone" , phone);
        System.out.println("sdfsdfsdfsddsfsdf");
        // Append new goals here

        try {
            resourceCollection.insertOne(newResources);
            ObjectId id = newResources.getObjectId("_id");

            System.err.println("Successfully added new Resources [_id=" + id + ", purpose=" + purpose + ", category=" + category + ", name=" + name +  ", phone="+ phone +']');
            //return id.toHexString();
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

    public String editResources(String id, String purpose, String category, String phone, String name){
        System.out.println("Right here again");
        Document newResources = new Document();
        newResources.append("purpose", purpose);
        newResources.append("category", category);
        newResources.append("name", name);
        newResources.append("phone", phone);
        Document setQuery = new Document();
        setQuery.append("$set", newResources);

        Document searchQuery = new Document().append("_id", new ObjectId(id));

        System.out.println(id);

        try {
            resourceCollection.updateOne(searchQuery, setQuery);
            ObjectId id1 = searchQuery.getObjectId("_id");
            System.err.println("Successfully updated resource [_id=" + id1 + ", purpose=" + purpose +
                ", category=" + category + ", name=" + name + ", phone=" + phone + ']');
            return JSON.serialize(id1);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

    public void deleteResources(String name){
        Document searchQuery = new Document().append("_id", new ObjectId(name));

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
