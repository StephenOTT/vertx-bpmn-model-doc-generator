# Camunda BPMN Model API to Freemarker Template

This is a use case example of using the CamundaBPM (Camunda.org) Model API with Vertx.
Allows you to provide a BPMN file which will be read and parsed by Camunda's Java Model API and then rendered through a provided FreeMarker template.

## Still not sure what this does...

This lets you provide a FreeMarker template and a BPMN file; the output is a rendered template.  The purpose is to allow someone to navigate the Camunda BPMN model API directly in the FreeMarker template in order to easily generate documentation for BPMN files.

# Setup

Install NPM Dependencies: `./gradlew clean npmInstall`

Run Gradle Build: `./gradlew clean run`

# References

1. https://docs.camunda.org/javadoc/camunda-bpm-platform/7.8/?org/camunda/bpm/model/bpmn/instance/package-summary.html
1. User Tasks Model Element: https://docs.camunda.org/javadoc/camunda-bpm-platform/7.8/org/camunda/bpm/model/bpmn/instance/UserTask.html


# FreeMarker Template

Example:

```freemarker
<#list userTasks as userTask>                                   
    <tr>
      <td>NAME: ${userTask.getName()}</td>
      <td>ELEMENT TYPE: ${userTask.getElementType().getTypeName()}</td>
      <td>ASSIGNEE: ${userTask.getCamundaAssignee()}</td>
      <tr>
      <#list userTask.getExtensionElements().getElementsQuery().filterByType(extensionElements).singleResult().getCamundaProperties() as extensionElement>
        <td>KEY: ${extensionElement.getCamundaName()}     VALUE: ${extensionElement.getCamundaValue()}</td>
      </#list>
      </tr
   </tr>
</#list>
```

# FreeMarker Input Example

This is a example of the object/hashmap that is inserted into Freemarker

```js
var inputs = {
  "extensionElements": instanceClass('camunda.CamundaProperties'),
  "userTasks": modelInstance.getModelElementsByType(instanceClass('UserTask'))
}
```

The `extensionElements` property is a special property that provides the CamundaProperties Class for use in the FreeMarker template such as:

```freemarker
<#list userTask.getExtensionElements().getElementsQuery().filterByType(extensionElements).singleResult().getCamundaProperties() as extensionElement>
```


# Console Output

```html
    <tr>
      <td>NAME: Step 1</td>
      <td>ELEMENT TYPE: userTask</td>
      <td>ASSIGNEE: steve</td>
      <tr>
        <td>KEY: order     VALUE: some order value</td>
        <td>KEY: title     VALUE: some title value</td>
        <td>KEY: failure     VALUE: some fail</td>
        <td>KEY: resolution     VALUE: some resolution</td>
      </tr>
   </tr>
    <tr>
      <td>NAME: Step 2</td>
      <td>ELEMENT TYPE: userTask</td>
      <td>ASSIGNEE: john</td>
      <tr>
        <td>KEY: order     VALUE: order123</td>
        <td>KEY: title     VALUE: title321</td>
        <td>KEY: failure     VALUE: fail000</td>
        <td>KEY: resolution     VALUE: resABC</td>
      </tr>
   </tr>
    <tr>
      <td>NAME: Step 3</td>
      <td>ELEMENT TYPE: userTask</td>
      <td>ASSIGNEE: chris</td>
      <tr>
        <td>KEY: order     VALUE: My Order</td>
        <td>KEY: title     VALUE: My Title</td>
        <td>KEY: failure     VALUE: My Failure</td>
        <td>KEY: resolution     VALUE: My Resolution</td>
      </tr>
   </tr>
```

# BPMN File XML Snippet

```xml
    <bpmn:userTask id="Task_0w364uq" name="Step 3" camunda:assignee="chris">
      <bpmn:extensionElements>
        <camunda:properties>
          <camunda:property name="order" value="My Order" />
          <camunda:property name="title" value="My Title" />
          <camunda:property name="failure" value="My Failure" />
          <camunda:property name="resolution" value="My Resolution" />
        </camunda:properties>
      </bpmn:extensionElements>
      <bpmn:incoming>SequenceFlow_0adri7o</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_15kfmnc</bpmn:outgoing>
    </bpmn:userTask>
```


# TODO / Enhancements:

1. Provide external / injectable `input` object as a HOCON file.
1. Config/Input defines the Template
1. Provide a File Writer
1. Add more generation get Elements call so that all elements are gotten and the FreeMarker template will sub-navigate the tree of elements. (Removes the current need to setup "Per Element Type" properties in the `inputs` object)
1. Provide a HTTP endpoint to get the rendered template as different content types such as JSON and HTML
1. Provide a HTTP Endpoint to inject Config and FTL templates so the parser can live as a "microservice"
1. Generate Image of BPMN file
1. Generate Zoomed in Image of BPMN Element in context of overall file


