
<#list tasks_>
Elements:
  <#items as task>
  Task Type:
  ${task.getElementType().getTypeName()}

  Task Name:
  ${task.getName()}

  Custom Attributes:
  <#list task.getExtensionElements().getElementsQuery().filterByType(extensionElements_).singleResult().getCamundaProperties()>
    <#items as extensionElement>
      Attribute:
      Key: ${extensionElement.getCamundaName()}
      Value: ${extensionElement.getCamundaValue()}

    </#items>
  </#list>
--------------------

  </#items>
</#list>