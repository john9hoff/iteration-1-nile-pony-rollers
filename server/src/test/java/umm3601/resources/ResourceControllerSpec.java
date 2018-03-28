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
            "                    resourceBody: \"Clean my room\",\n" +
            "                    resourcePhone: \"123-123-1234\",\n" +
            "                }"));
        testResources.add(Document.parse("{\n" +
            "                   resourceBody: \"Wash Dishes\",\n" +
            "                    resourcePhone: \"345-345-3456\",\n" +
            "                }"));
        testResources.add(Document.parse("{\n" +
            "                    resourceBody: \"Make cookies\",\n" +
            "                    resourcePhone: \"567-567-5678\",\n" +
            "                }"));
        huntersID = new ObjectId();
        BasicDBObject hunter = new BasicDBObject("resourceName", huntersID);
        hunter = hunter.append("resourceBody", "Call mom")
            .append("resourcePhone", "987-987-9876");
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


    private static String getresourceBody(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("resourceBody")).getValue();
    }

    private static String getresourcePhone(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("resourcePhone")).getValue();
    }

    @Test
    public void getAllResources() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = resourceController.getresources(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 resource", 4, docs.size());
        List<String> resources = docs
            .stream()
            .map(ResourceControllerSpec::getresourceBody)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedBodys = Arrays.asList("Clean my room", "Wash Dishes", "Make cookies");
        assertEquals("resources should match", expectedBodys, resources);
    }

    @Test
    public void getresourceByName() {
        Map<String, String[]> argMap = new HashMap<>();
        // Mongo in GoalController is doing a regex search so can just take a Java Reg. Expression
        // This will search the category for letters 'f' and 'c'.
        argMap.put("resourcesPhone", new String[]{"[f, c]"});
        String jsonResult = resourceController.getresources(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        assertEquals("Should be 3 resource", 3, docs.size());
        List<String> name = docs
            .stream()
            .map(ResourceControllerSpec::getresourcePhone)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedName = Arrays.asList("Call mom", "Make cookies", "Wash dishes");
        assertEquals("Names should match", expectedName, name);
    }

    @Test
    public void getHuntersByID() {
        String jsonResult = resourceController.getresource(huntersID.toHexString());
        Document hunterDoc = Document.parse(jsonResult);
        assertEquals("Name should match", "Call mom", hunterDoc.get("name"));
        String noJsonResult = resourceController.getresource(new ObjectId().toString());
        assertNull("No name should match", noJsonResult);
    }

    @Test
    public void addResourceTest() {
        String newName = resourceController.addNewResource("Self defense from Bobs", "232-678-2358", "Kick Bob");

        assertNotNull("Add new resource should return true when resource is added,", newName);
        Map<String, String[]> argMap = new HashMap<>();
        String jsonResult = resourceController.getresources(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> purpose = docs
            .stream()
            .map(ResourceControllerSpec::getresourceBody)
            .sorted()
            .collect(Collectors.toList());
        // name.get(0) says to get the name of the first person in the database,
        // so "Bob" will probably always be first because it is sorted alphabetically.
        // 3/4/18: Not necessarily: it is likely that that is how they're stored but we don't know. Find a different way of doing this.
        assertEquals("Should return purpose of new resource", "Self defense from Bobs", purpose.get(3));
    }

    @Test
    public void editResourcesTest() {
        String newId = resourceController.editResources("Peter", "To have a better environment", "320-288-1234", "Hug KK");
        assertNotNull("Edit rsource should return true when rsource is edited,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        String jsonResult = resourceController.getresources(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        List<String> purpose = docs
            .stream()
            .map(ResourceControllerSpec::getresourceBody)
            .sorted()
            .collect(Collectors.toList());
        assertEquals("Should return purpose of edited resource", "To have a better environment", purpose.get(3));
    }

    @Test
    public void deleteResourceTest() {
        System.out.println("HuntersID " + huntersID.toHexString());
        resourceController.deleteresources(huntersID.toHexString());
        Map<String, String[]> argMap = new HashMap<>();
        String jsonResult = resourceController.getresources(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        assertEquals("Should be 3 resource", 3, docs.size());
    }
}

