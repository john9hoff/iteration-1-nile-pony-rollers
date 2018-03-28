package umm3601.report;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.BsonArray;
import org.bson.Document;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;
import umm3601.tracker.TrackerController;

import java.io.IOException;
import java.util.*;

import static org.junit.Assert.assertEquals;

public class ReportControllerSpec {

    private ReportController reportController;
    private ObjectId samsId;

    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> reportDocuments = db.getCollection("trackers");
        reportDocuments.drop();
        List<Document> testReports= new ArrayList<>();
        testReports.add(Document.parse("{\n" +
            "                    emoji: \"grinning\",\n" +
            "                    email: \"opheliawinters@flexigen.com\",\n" +
            "                    date: \"Tue Jul 27 1971 03:15:18 GMT-0500 (CDT)\",\n" +
            "                    rating: 2,\n" +
            "                }"));
        testReports.add(Document.parse("{\n" +
            "                    emoji: \"smiling\",\n" +
            "                    email: \"gildatorres@flexigen.com\",\n" +
            "                    date: \"Thu Jan 30 1975 19:53:45 GMT-0600 (CST)\",\n" +
            "                    rating: 4,\n" +
            "                }"));
        testReports.add(Document.parse("{\n" +
            "                    emoji: \"confused\",\n" +
            "                    email: \"sashawatson@flexigen.com\",\n" +
            "                    date: \"Tue Jun 06 1978 03:09:54 GMT-0500 (CDT)\",\n" +
            "                    rating: 3,\n" +
            "                }"));
        testReports.add(Document.parse("{\n" +
            "                    emoji: \"angry\",\n" +
            "                    email: \"opheliawinters@flexigen.com\",\n" +
            "                    date: \"Tue Jan 14 2014 18:35:56 GMT-0600 (CST)\",\n" +
            "                    rating: 1,\n" +
            "                }"));



        reportDocuments.insertMany(testReports);

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        reportController = new ReportController(db);
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

    //This is really the same test as getAllTrackers in TrackerControllerSpec
    @Test
    public void getAllReports() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = reportController.getReports(emptyMap);

        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 trackers", 4, docs.size());

    }
}
