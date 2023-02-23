package cn.ac.bmi.cloudphr.mapper;

import cn.ac.bmi.cloudphr.mapper.schema.Mapper;
import cn.ac.bmi.cloudphr.mapper.schema.Mapping;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;

public class MappingUtils {

  protected static <F, T> void convert(F from, Map<String, Object> to, Map<String, Mapper> mappers, String name) {
    Mapper mapper = mappers.get(name);
    if (mapper == null || mapper.getMappings() == null) {
      return;
    }
    for (Mapping mapping : mapper.getMappings()) {
      if (StringUtils.isBlank(mapping.getAction())) {
        if (StringUtils.isNotBlank(mapping.getActRef())) {
          mapping.setAction("one2one");
        } else {
          mapping.setAction("direct");
        }
      }
      switch (mapping.getAction()) {
        case "constant":
          JsonPathUtils.set(to, mapping.getTo(), mapping.getFrom());
          break;
        case "direct":
          Object fromValue = MappingUtils.getFromValue(from, mapping);
          JsonPathUtils.set(to, mapping.getTo(), fromValue);
          break;
        case "one2one":
          MappingUtils.one2one(from, to, mappers, name, mapping);
          break;
        case "one2many":
          MappingUtils.one2many(from, to, mappers, name, mapping);
          break;
        case "many2many":
          MappingUtils.many2many(from, to, mappers, name, mapping);
          break;
        default:
          break;
      }
    }
  }

  private static <F> void one2one(F from, Map<String, Object> to, Map<String, Mapper> mappers, String name,
                                  Mapping mapping) {
    throwExceptionIfError(name, mapping);

    Object fromValue = getFromValue(from, mapping);
    Map<String, Object> toObj = (Map<String, Object>) getOrSet(to, mapping);
    convert(fromValue, toObj, mappers, mapping.getActRef());
  }

  private static <F> void one2many(F from, Map<String, Object> to, Map<String, Mapper> mappers, String name,
                                   Mapping mapping) {
    throwExceptionIfError(name, mapping);

    List<Object> toList = getOrSetToList(to, mapping);
    Object fromValue = getFromValue(from, mapping);
    Map<String, Object> toObj = new LinkedHashMap<>();
    toList.add(toObj);
    convert(fromValue, toObj, mappers, mapping.getActRef());
  }

  private static <F> void many2many(F from, Map<String, Object> to, Map<String, Mapper> mappers, String name,
                                    Mapping mapping) {
    throwExceptionIfError(name, mapping);

    List<Object> toList = getOrSetToList(to, mapping);
    Object fromValue = getFromValue(from, mapping);
    if (fromValue instanceof List) {
      for (Object item : (List) fromValue) {
        Map<String, Object> toObj = new LinkedHashMap<>();
        toList.add(toObj);
        convert(item, toObj, mappers, mapping.getActRef());
      }
    }
  }

  private static <F> Object getFromValue(F from, Mapping mapping) {
    if (mapping.getFrom().equals("__THIS__")) {
      return from;
    } else {
      return JsonPathUtils.get(from, mapping.getFrom());
    }
  }

  private static void throwExceptionIfError(String name, Mapping mapping) {
    if (mapping.getActRef() == null || "".equals(mapping.getActRef().trim())) {
      throw new RuntimeException("Error in mapper(" + name + ")>" + mapping.toString());
    }
  }

  private static List<Object> getOrSetToList(Map<String, Object> to, Mapping mapping) {
    List<Object> toArray = (List<Object>) JsonPathUtils.get(to, mapping.getTo());
    if (toArray == null) {
      toArray = new ArrayList<>();
      JsonPathUtils.set(to, mapping.getTo(), toArray);
    }
    return toArray;
  }

  private static Object getOrSet(Map<String, Object> to, Mapping mapping) {
    Object toObj = JsonPathUtils.get(to, mapping.getTo());
    if (toObj == null) {
      toObj = new HashMap<String, Object>();
      JsonPathUtils.set(to, mapping.getTo(), toObj);
    }
    return toObj;
  }
}
