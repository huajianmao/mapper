package cn.ac.bmi.cloudphr.mapper;

import cn.ac.bmi.cloudphr.mapper.schema.Mapper;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Translator {
  public static <F> List<Map<String, Object>> translate(List<F> items, List<Mapper> mappers) {
    List<Map<String, Object>> records = new ArrayList<>();
    if (mappers == null || mappers.isEmpty()) {
      return records;
    }

    Map<String, Mapper> mapperIndex = new HashMap<>();
    for (Mapper mapper : mappers) {
      mapperIndex.put(mapper.getName(), mapper);
    }

    String name = mappers.get(0).getName();
    for (F item : items) {
      Map<String, Object> record = new HashMap<>();
      MappingUtils.convert(item, record, mapperIndex, name);
      records.add(record);
    }
    return records;
  }
}
