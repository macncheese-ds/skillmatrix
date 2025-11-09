// Java/Axis minimal SOAP webservice example
// Requires Apache Axis 1.x, Java 8+
// Compile: javac -cp axis.jar;. HelloService.java
// Deploy: Copy to Axis webapps/services, register in deploy.wsdd
// WSDL: http://localhost:8080/axis/services/HelloService?wsdl

public class HelloService {
  public String sayHello(String name) {
    return "Hola, " + name + "! (desde Axis SOAP)";
  }
}
