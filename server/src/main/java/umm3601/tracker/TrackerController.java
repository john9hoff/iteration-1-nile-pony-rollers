package umm3601.tracker;

import com.google.gson.Gson;
import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;

import javax.sound.midi.Track;
import java.util.Calendar;
import java.util.Iterator;
import java.util.Map;
import java.util.Date;

import static com.mongodb.client.model.Filters.eq;

/**
 * Controller that manages requests for info about trackers.
 */
public class TrackerController {

    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> trackerCollection;

    /**
     * Construct a controller for trackers.
     *
     * @param database the database containing tracker data
     */
    public TrackerController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        trackerCollection = database.getCollection("trackers");
    }

    /**
     * Helper method that gets a single tracker specified by the `id`
     * parameter in the request.
     *
     * @param id the Mongo ID of the desired tracker
     * @return the desired tracker as a JSON object if the tracker with that ID is found,
     * and `null` if no tracker with that ID is found
     */
    public String getTracker(String id) {
        FindIterable<Document> jsonTrackers
            = trackerCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonTrackers.iterator();
        if (iterator.hasNext()) {
            Document tracker = iterator.next();
            return tracker.toJson();
        } else {
            // We didn't find the desired tracker
            return null;
        }
    }


    /** Helper method which iterates through the collection, receiving all
     * documents if no query parameter is specified. If the age query parameter
     * is specified, then the collection is filtered so only documents of that
     * specified age are found.
     *
     * @param queryParams
     * @return an array of Trackers in a JSON formatted string
     */
    public String getTrackers(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();

        if (queryParams.containsKey("emoji")) {
            String targetContent = (queryParams.get("emoji")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("emoji", contentRegQuery);
        }

        if (queryParams.containsKey("date")) {
            String targetContent = (queryParams.get("date")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("date", contentRegQuery);
        }

        if (queryParams.containsKey("rating")) {
            int targetAge = Integer.parseInt(queryParams.get("rating")[0]);
            filterDoc = filterDoc.append("rating", targetAge);
        }

        //FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingTrackers = trackerCollection.find(filterDoc);

        return JSON.serialize(matchingTrackers);
    }


    /**
     * Helper method which appends received tracker information to the to-be added document
     *
     * @param emoji
     * @return boolean after successfully or unsuccessfully adding a tracker
     */
    public String addNewTracker(String emoji, int rating) {

        Document newTracker = new Document();
        newTracker.append("emoji", emoji);
        newTracker.append("rating",rating);
        Date now = new Date();
        newTracker.append("date", now.toString());


        try {
            trackerCollection.insertOne(newTracker);
            ObjectId id = newTracker.getObjectId("_id");
            System.err.println("Successfully added new tracker [_id=" + id + ", emoji=" + emoji + ", date=" + now.toString() + "rating = " + rating +']');
            // return JSON.serialize(newTracker);
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }


}
