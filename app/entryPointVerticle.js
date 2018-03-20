exports.vertxStart = function() {
  console.log("Starting primary verticle")
}
exports.vertxStop = function() {
  console.log('Stopping primary verticle')
}

var _ = require('lodash')

// Setup classload to current path for this verticle
var classloader = java.lang.Thread.currentThread().getContextClassLoader()

// Setup freemarker
var Configuration = Java.type('freemarker.template.Configuration')
var cfg = new Configuration
cfg.setClassLoaderForTemplateLoading(classloader,'templates')

// Setup Camunda Model API
var Bpmn = Java.type('org.camunda.bpm.model.bpmn.Bpmn')
var ModelInstance = Java.type('org.camunda.bpm.model.bpmn.BpmnModelInstance')

// Get the BPMN File and create a ModelInstance
var bpmnFile = classloader.getResourceAsStream('bpmn/myProcess.bpmn')
var modelInstance = Bpmn.readModelFromStream(bpmnFile)

// Helper function for getting the Class of ModelInstance Types
function instanceClass(type){
  // https://docs.camunda.org/javadoc/camunda-bpm-platform/7.8/?org/camunda/bpm/model/bpmn/instance/package-summary.html
  var bpmnInstanceClass = Java.type('org.camunda.bpm.model.bpmn.instance.' + type).class
  return bpmnInstanceClass
}

// Object for each of the objects to be rendered by the freemarker Template
var inputs = {
  "extensionElements": instanceClass('camunda.CamundaProperties'),
  "userTasks": modelInstance.getModelElementsByType(instanceClass('UserTask'))
}
// User Tasks Model Element: https://docs.camunda.org/javadoc/camunda-bpm-platform/7.8/org/camunda/bpm/model/bpmn/instance/UserTask.html

var inputs_pre = JSON.parse(org.apache.commons.io.IOUtils.toString(classloader.getResourceAsStream('template_config.json'), 'UTF-8'))
var inputs_post = inputs_pre

_.forOwn(inputs_post['template_inputs'], function(value, key) {
  // Any property in the template)inputs object that 
  // has a property name that end with a underscore(_) 
  // will go through eval().
  if (_.endsWith(key, '_')){
    inputs_post['template_inputs'][key] = eval(value)
  }
})

var templatePath = inputs_post['template_path']

// Render Template
var template = cfg.getTemplate(templatePath);
var writer = new java.io.StringWriter()
template.process(inputs_post['template_inputs'], writer);

// print the rendered template to console
print(writer)