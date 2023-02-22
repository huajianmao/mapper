package cn.ac.bmi.cloudphr.mapper.schema;

import java.util.List;
import lombok.Data;

@Data
public class Mapper {
  private String name;
  private String source;
  private String model;
  private List<Mapping> mappings;
}
