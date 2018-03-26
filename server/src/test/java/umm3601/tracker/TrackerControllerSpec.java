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

    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> trackerDocuments = db.getCollection("trackers");
        trackerDocuments.drop();
        List<Document> testTrackers= new ArrayList<>();
        testTrackers.add(Document.parse("{\n" +
            "                    emoji: \"grinning\",\n" +
            "                }"));
        testTrackers.add(Document.parse("{\n" +
            "                    emoji: \"smiling\",\n" +
            "                }"));
        testTrackers.add(Document.parse("{\n" +
            "                    emoji: \"confused\",\n" +
            "                }"));
        testTrackers.add(Document.parse("{\n" +
            "                    emoji: \"angry\",\n" +
            "                }"));



        trackerDocuments.insertMany(testTrackers);

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

    @Test
    public void getAllEmojis() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = trackerController.getTrackers(emptyMap);

        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 trackers", 4, docs.size());

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
        String newId = trackerController.addNewTracker("frowning");

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
