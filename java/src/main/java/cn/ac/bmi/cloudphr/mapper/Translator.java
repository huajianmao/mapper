package cn.ac.bmi.cloudphr.mapper;

import cn.ac.bmi.cloudphr.mapper.schema.Mapper;
import cn.ac.bmi.cloudphr.mapper.schema.Mapping;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;

public class Translator {
  public static <S, B> List<B> translate(List<S> items, List<Mapper> mappers) {
    List<B> records = new ArrayList<>();
    if (mappers == null || mappers.isEmpty()) {
      return records;
    }

    Map<String, Mapper> mapperIndex = new HashMap<>();
    for (Mapper mapper : mappers) {
      mapperIndex.put(mapper.getName(), mapper);
    }

    String name = mappers.get(0).getName();
    for (S item : items) {
      Map<String, Object> record = new HashMap<>();
      convert(item, record, mapperIndex, name);
      records.add((B) record);
    }
    return records;
  }

  private static <F> void convert(F from, Map<String, Object> to, Map<String, Mapper> mappers, String name) {
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
          to.put(mapping.getTo(), mapping.getFrom());
          break;
        case "direct":
          Object fromValue = getFromValue(from, mapping);
          to.put(mapping.getTo(), fromValue);
          break;
        case "one2one":
          one2one(from, to, mappers, name, mapping);
          break;
        case "one2many":
          one2many(from, to, mappers, name, mapping);
          break;
        case "many2many":
          many2many(from, to, mappers, name, mapping);
          break;
        default:
          break;
      }
    }
  }

  private static <F, T> void one2one(F from, Map<String, Object> to, Map<String, Mapper> mappers, String name,
                                     Mapping mapping) {
  }

  private static <F, T> void one2many(F from, Map<String, Object> to, Map<String, Mapper> mappers, String name,
                                      Mapping mapping) {

  }
  
  private static <F, T> void many2many(F from, Map<String, Object> to, Map<String, Mapper> mappers, String name,
                                       Mapping mapping) {

  }

  private static <F> Object getFromValue(F from, Mapping mapping) {
    return null;
  }
}
