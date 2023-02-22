package cn.ac.bmi.cloudphr.mapper.schema;

import lombok.Data;

@Data
public class Mapping {
  private String from;
  private String to;
  private String action;
  private String actRef;
}
