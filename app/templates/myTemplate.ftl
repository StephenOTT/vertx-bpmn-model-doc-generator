<#list userTasks as userTask>                                   
    <tr>
      <td>NAME: ${userTask.getName()}</td>
      <td>ELEMENT TYPE: ${userTask.getElementType().getTypeName()}</td>
      <td>ASSIGNEE: ${userTask.getCamundaAssignee()}</td>
      <tr>
      <#list userTask.getExtensionElements().getElementsQuery().filterByType(extensionElements).singleResult().getCamundaProperties() as extensionElement>
        <td>KEY: ${extensionElement.getCamundaName()}     VALUE: ${extensionElement.getCamundaValue()}</td>
      </#list>
      </tr>
   </tr>
</#list>