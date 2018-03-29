package umm3601.resources;
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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class ResourceControllerSpec {
    private ResourceController resourceController;
    private ObjectId huntersID;

    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> resourcesDocuments = db.getCollection("resources");

        resourcesDocuments.drop();
        List<Document> testResources = new ArrayList<>();
        testResources.add(Document.parse("{\n" +
            "                    name: \"Clean my room\",\n" +
            "                    purpose: \"To have a better environment\",\n" +
            "                    phone: \"123-486-4562\",\n" +
            "                    category: \"Living\",\n" +
            "                }"));
        testResources.add(Document.parse("{\n" +
            "                    name: \"Wash dishes\",\n" +
            "                    purpose: \"Cleaner kitchen\",\n" +
            "                    phone: \"154-352-4865\",\n" +
            "                    category: \"Chores\",\n" +
            "                }"));
        testResources.add(Document.parse("{\n" +
            "                    name: \"Make cookies\",\n" +
            "                    purpose: \"Get fatter\",\n" +
            "                    phone: \"654-786-3515\",\n" +
            "                    category: \"Food\",\n" +

            "                }"));
        huntersID = new ObjectId();
        BasicDBObject hunter = new BasicDBObject("_id", huntersID);
        hunter = hunter.append("name", "Call mom")
            .append("purpose", "Improve relationship")
            .append("phone", "896-325-4126")
            .append("category", "Family");
        resourcesDocuments.insertMany(testResources);
        resourcesDocuments.insertOne(Document.parse(hunter.toJson()));

        resourceController = new ResourceController(db);
    }

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


    private static String getPurpose(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("purpose")).getValue();
    }

    private static String getName(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("name")).getValue();
    }

    @Test
    public void getAllResources() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = resourceController.getResources(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 resource", 4, docs.size());
        List<String> resources = docs
            .stream()
            .map(ResourceControllerSpec::getPurpose)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedBodys = Arrays.asList("Cleaner kitchen", "Get fatter", "Improve relationship", "To have a better environment");
        assertEquals("resources should match", expectedBodys, resources);
    }

    @Test
    public void getResourceByCategory() {
        Map<String, String[]> argMap = new HashMap<>();
        // Mongo in GoalController is doing a regex search so can just take a Java Reg. Expression
        // This will search the category for letters 'f' and 'c'.
        argMap.put("category", new String[]{"[f, c]"});
        String jsonResult = resourceController.getResources(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        assertEquals("Should be 3 resource", 3, docs.size());
        List<String> name = docs
            .stream()
            .map(ResourceControllerSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedName = Arrays.asList("Call mom", "Make cookies", "Wash dishes");
        assertEquals("Names should match", expectedName, name);
    }

    @Test
    public void getHuntersByID() {
        String jsonResult = resourceController.getResource(huntersID.toHexString());
        Document hunterDoc = Document.parse(jsonResult);
        assertEquals("Name should match", "Call mom", hunterDoc.get("name"));
        String noJsonResult = resourceController.getResource(new ObjectId().toString());
        assertNull("No name should match", noJsonResult);
    }

    @Test
    public void addResourceTest() {
        String newId = resourceController.addNewResource("Self defense from Bobs", "Injury", "Kick Bob", "232-678-2358");

        assertNotNull("Add new resource should return true when resource is added,", newId);

        Map<String, String[]> argMap = new HashMap<>();
        String jsonResult = resourceController.getResources(argMap);
        BsonArray docs = parseJsonArray(jsonResult);


        assertEquals("Should be 4 resource", 5, docs.size());
    }

    @Test
    public void editResourcesTest() {
        String newId = resourceController.editResources("5ab53a8907d923f68d03e1a3", "To have a better environment", "Family", "320-288-1234", "Hug KK");
        assertNotNull("Edit rsource should return true when rsource is edited,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        String jsonResult = resourceController.getResources(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        List<String> purpose = docs
            .stream()
            .map(ResourceControllerSpec::getPurpose)
            .sorted()
            .collect(Collectors.toList());
        assertEquals("Should return purpose of edited resource", "To have a better environment", purpose.get(3));
    }

    @Test
    public void deleteResourceTest() {
        System.out.println("HuntersID " + huntersID.toHexString());
        resourceController.deleteResources(huntersID.toHexString());
        Map<String, String[]> argMap = new HashMap<>();
        String jsonResult = resourceController.getResources(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        assertEquals("Should be 3 resource", 3, docs.size());
    }
}

