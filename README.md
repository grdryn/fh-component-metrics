# fh-component-metrics 

This component is used to gather metrics such as CPU and memory usage. Using InfluxDB and 
Grafana you can easily visualise the metrics.

The following docker image was used to build the necessary infrastructure
to investigate this:
https://github.com/StackPointCloud/docker-influxdb

# Influxdb Version

The 2.x version of this component is compatible with 0.10 release of Influxdb. It is using the line protocol to send metrics data over UDP port. Please make sure UDP is enabled in the Influxdb configurations.


# Usage Guide

Here are the steps to use this module in an existing RHMAP component:

1. add this module as a dependency:

    ```
    npm install fh-component-metrics --save
    ```

2. Then you can capture CPU & memory usage in the component use this code:

    ```
    var fhComponentMetrics = require('fh-component-metrics');
    var metricsConf = {enabled: true, host: '1.2.3.4', port: 2003};
    var metrics = fhComponentMetrics(metricsConf);
    var TITLE = 'myTestComponent';
    metrics.memory(TITLE, { interval: 2000 }, function(err) {
      if (err) logger.warn(err);
    });

    metrics.cpu(TITLE, { interval: 1000 }, function(err) {
      if (err) logger.warn(err);
    });
    ```

3. To capture API time, you can add the timingMiddleware to an existing express app like this:

    ```
    var fhComponentMetrics = require('fh-component-metrics');
    var metricsConf = {enabled: true, host: '1.2.3.4', port: 2003};
    var app = express();
    app.use(fhComponentMetrics.timingMiddleware('myExpressApp', metricsConf));
    ```

4. It's better the add the metrics configuration into the component's configuation file. E.g.

    ```
    {
      ...,
      "component_metrics": {
        "enabled": true,
        "host": "1.2.3.4",
        "port": 2003
      },
      ...
    }
    ```