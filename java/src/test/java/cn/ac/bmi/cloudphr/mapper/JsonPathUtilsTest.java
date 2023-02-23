package cn.ac.bmi.cloudphr.mapper;


import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.Test;

public class JsonPathUtilsTest {

  @Test
  public void get() {
    Map<String, Object> map = new HashMap<>();
    Map<String, Object> innerMap = new HashMap<>();
    innerMap.put("d", "value");
    Map<String, Object> middleMap = new HashMap<>();
    middleMap.put("c", innerMap);
    map.put("a", middleMap);
    List<Integer> b = Arrays.asList(1, 2, 3);
    middleMap.put("b", b);

    Object value = JsonPathUtils.get(map, "a.b");
    assertArrayEquals(b.toArray(), ((List) value).toArray());

    value = JsonPathUtils.get(map, "a.c.d");
    assertEquals("value", value);

    JsonPathUtils.set(map, "a.c.d", "valueRevised");
    value = JsonPathUtils.get(map, "a.c.d");
    assertEquals("valueRevised", value);

    value = JsonPathUtils.get(map, "a.b[0]");
    assertEquals(1, value);

    value = JsonPathUtils.get(map, "a.b.x.y.z");
    assertNull(value);


    JsonPathUtils.set(map, "a.x.y.z", b);
    value = JsonPathUtils.get(map, "a.x.y.z");
    assertArrayEquals(b.toArray(), ((List) value).toArray());
  }
}