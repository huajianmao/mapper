package cn.ac.bmi.cloudphr.mapper;

import static org.junit.Assert.assertEquals;

import cn.ac.bmi.cloudphr.mapper.schema.Mapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import org.junit.Test;

public class TranslatorTest {
  ObjectMapper mapper = new ObjectMapper();


  @Test
  public void translate() throws Exception {
    List<Mapper> schemas = readJsonFile("schema/checkup.json", Mapper.class);
    assertEquals(schemas.size(), 6);

    Class<Map<String, Object>> clazz = (Class<Map<String, Object>>) (Class) Map.class;
    List<Map<String, Object>> items = readJsonFile("data/checkup.json", clazz);
    assertEquals(items.size(), 2);

    List<Map<String, Object>> records = Translator.translate(items, schemas);
    assertEquals(records.size(), 2);
    System.out.println(mapper.writeValueAsString(records));
  }

  private <T> List<T> readJsonFile(String path, Class<T> clazz) throws Exception {
    URL url = getClass().getClassLoader().getResource(path);
    String jsonString = new String(Files.readAllBytes(Paths.get(url.toURI())));
    return mapper.readValue(jsonString, mapper.getTypeFactory().constructCollectionType(List.class, clazz));
  }
}