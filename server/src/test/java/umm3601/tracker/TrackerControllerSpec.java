package umm3601.tracker;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

/**
 * JUnit tests for the TrackerController.
 *
 */
public class TrackerControllerSpec
{
    private TrackerController trackerController;
    private ObjectId samsId;

    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> trackerDocuments = db.getCollection("trackers");
        trackerDocuments.drop();
        List<Document> testTrackers= new ArrayList<>();
        testTrackers.add(Document.parse("{\n" +
            "                    emoji: \"grinning\",\n" +
            "                    email: \"opheliawinters@flexigen.com\",\n" +
            "                    date: \"Tue Jul 27 1971 03:15:18 GMT-0500 (CDT)\",\n" +
            "                    rating: 2,\n" +
            "                }"));
        testTrackers.add(Document.parse("{\n" +
            "                    emoji: \"smiling\",\n" +
            "                    email: \"gildatorres@flexigen.com\",\n" +
            "                    date: \"Thu Jan 30 1975 19:53:45 GMT-0600 (CST)\",\n" +
            "                    rating: 4,\n" +
            "                }"));
        testTrackers.add(Document.parse("{\n" +
            "                    emoji: \"confused\",\n" +
            "                    email: \"sashawatson@flexigen.com\",\n" +
            "                    date: \"Tue Jun 06 1978 03:09:54 GMT-0500 (CDT)\",\n" +
            "                    rating: 3,\n" +
            "                }"));
        testTrackers.add(Document.parse("{\n" +
            "                    emoji: \"angry\",\n" +
            "                    email: \"opheliawinters@flexigen.com\",\n" +
            "                    date: \"Tue Jan 14 2014 18:35:56 GMT-0600 (CST)\",\n" +
            "                    rating: 1,\n" +
            "                }"));


        samsId = new ObjectId();
        BasicDBObject sam = new BasicDBObject("_id", samsId);
        sam = sam.append("emoji", "Happy")
            .append("email", "sam@frog.com")
            .append("date", "Tue Jan 14 2014 18:35:56 GMT-0600")
            .append("rating", 2);


        trackerDocuments.insertMany(testTrackers);
        trackerDocuments.insertOne(Document.parse(sam.toJson()));
        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        trackerController = new TrackerController(db);
    }

    // http://stackoverflow.com/questions/34436952/json-parse-equivalent-in-mongo-driver-3-x-for-java
    private BsonArray parseJsonArray(String json) {
        final CodecRegistry codecRegistry
            = CodecRegistries.fromProviders(Arrays.asList(
            new ValueCodecProvider(),
            new BsonValueCodecProvider(),
            new DocumentCodecProvider()));

        JsonReader reader = new JsonReader(json);
        BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

        return arrayReader.decode(reader, DecoderContext.builder().build());
    }

    private static String getEmoji(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("emoji")).getValue();
    }

    private static String getDate(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("date")).getValue();
    }

    @Test
    public void getAllTrackers() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = trackerController.getTrackers(emptyMap);

        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 trackers", 5, docs.size());

    }


    @Test
    public void getTrackerByIntensity(){
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("rating", new String[] { "1" });
        String jsonResult = trackerController.getTrackers(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 1 tracker", 1, docs.size());

        List<String> emojis = docs
            .stream()
            .map(TrackerControllerSpec::getEmoji)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedEmojis = Arrays.asList("angry");
        assertEquals("Rating should match", expectedEmojis, emojis);

    }


    @Test
    public void getTrackerByDate(){
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("date", new String[] { "Tue Jul 27 1971" });
        String jsonResult = trackerController.getTrackers(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 1 tracker", 1, docs.size());

        List<String> emojis = docs
            .stream()
            .map(TrackerControllerSpec::getDate)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedEmojis = Arrays.asList("Tue Jul 27 1971 03:15:18 GMT-0500 (CDT)");
        assertEquals("Rating should match", expectedEmojis, emojis);

    }


    @Test
    public void getSamById() {
        String jsonResult = trackerController.getTracker(samsId.toHexString());
        System.out.println(jsonResult);
        Document sam = Document.parse(jsonResult);

        assertEquals("Name should match", samsId, sam.get("_id"));
        String noJsonResult = trackerController.getTracker(new ObjectId().toString());
        assertNull("No id should match",noJsonResult);

    }

    @Test
    public void getSmilingTrackers() {
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("emoji", new String[] { "smiling" });
        String jsonResult = trackerController.getTrackers(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 1 tracker", 1, docs.size());
        List<String> emojis = docs
            .stream()
            .map(TrackerControllerSpec::getEmoji)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedEmojis = Arrays.asList("smiling");
        assertEquals("Emojis should match", expectedEmojis, emojis);
    }

    @Test
    public void addEmojiTest(){
        String newId = trackerController.addNewTracker("frowning",2);

        assertNotNull("Add new trackers should return true,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("emoji", new String[] { "frowning" });
        String jsonResult = trackerController.getTrackers(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> emoji = docs
            .stream()
            .map(TrackerControllerSpec::getEmoji)
            .sorted()
            .collect(Collectors.toList());
        assertEquals("Should return emoji of new tracker", "frowning", emoji.get(0));
    }
}
