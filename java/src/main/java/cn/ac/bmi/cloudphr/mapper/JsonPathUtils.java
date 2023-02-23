package cn.ac.bmi.cloudphr.mapper;

import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.Option;
import com.jayway.jsonpath.ParseContext;
import com.jayway.jsonpath.spi.mapper.JacksonMappingProvider;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

public class JsonPathUtils {

  private static final ParseContext context;

  static {
    Configuration config = Configuration.builder()
          .mappingProvider(new JacksonMappingProvider())
          .options(EnumSet.of(Option.SUPPRESS_EXCEPTIONS))
          .build();
    context = JsonPath.using(config);
  }

  protected static <T> Object get(T obj, String path) {
    try {
      return context.parse(obj).read(path);
    } catch (Exception e) {
      return null;
    }
  }

  protected static <T> void set(T obj, String path, Object value) {
    DocumentContext jsonContext = context.parse(obj);

    String[] keys = path.split("\\.");

    Map<String, Object> currentMap = jsonContext.json();
    for (int i = 0; i < keys.length - 1; i++) {
      Object objValue = currentMap.get(keys[i]);
      if (objValue instanceof Map) {
        currentMap = (Map<String, Object>) objValue;
      } else {
        Map<String, Object> newMap = new HashMap<>();
        currentMap.put(keys[i], newMap);
        currentMap = newMap;
      }
    }

    currentMap.put(keys[keys.length - 1], value);
  }
}
