# angular-easy-api
An easy way to generate a dynamic, injectable API service.

## Quick Start

+ Install angular-easy-api with [Bower](https://www.bower.io):

```
$ bower install angular-easy-api --save
```

+ Include the required libraries:

```html
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/angular-easy-api/angular-easy-api.min.js"></script>
```

+ Inject `angular-easy-api` into your application:

```javascript
angular.module('myApp', ['easyAPI']);
```

+ Construct and configure your API using the `easyAPIProvider`:

```javascript
angular
    .module('myApp', ['easyAPI'])
    .config(function(easyAPIProvider) {
        var api = {
            "host": "localhost",
            "protocol": "http",
            "endpoints": {
                "/todos/{id}": {
                    "namespace": "todo",
                    "methods": {
                        "updateTodo": "POST",
                        "getTodo": "GET"
                    }
                },

                "/todos/list": {
                    "namespace": "todo",
                    "methods": {
                        "listTodos": "GET"
                    }
                }
            }
        };

        easyAPIProvider.setJSON(api);
    });
```

+ Inject `easyAPI` into your controllers and services:

```javascript
angular
    .module('myApp', ['easyAPI'])
    .controller('todoCtrl', todoCtrl);

function todoCtrl($log, easyAPI) {
    var vm = this
    vm.list = list;

    function list() {
        easyAPI.todo.listTodos()
            .then(function(response) {
                $log.info('Todos:', response.data);
                // Do something cool!
            }, function(error) {
                $log.error(error);
                // Handle error
            });
    }
}
```

## Configuring your API JSON Object

The first step in configuring Easy API is by constructing your `API` JSON Object. This is used to construct your `easyAPI`, which can then be injected into controllers and services to trigger HTTP requests.

### API

| Property | Type | Description |
|-------------|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `host` | String | The URL of your host (i.e. "localhost", "tusharghate.com") |
| `protocol` | String | The protocol to use (i.e. "http", "https"). Defaults to "http". |
| `endpoints` | `Endpoints` | An key/value mapping of all endpoints in your API, where the key is the URL path to the endpoint and the value is an `Endpoint` Object. |

### Endpoints

`Endpoints` is a key/value mapping where each key represents the path to the endpoint, and the associated value is an `Endpoint`. Paths can also contain dynamic variables (i.e. "/path/{random}"). When data is passed to this endpoint, `random` will be substituted into the path before the HTTP request is triggered. For example:

```javascript
{
    "endpoints": {
        "/path/a": <Endpoint>
        "/path/b": <Endpoint>,
        "/path/c": <Endpoint>,
        "/path/{random}": <Endpoint>
    }
}
```

### Endpoint

| Property | Type | Description |
|-----------|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| namespace | String | The name-space that this endpoint belongs to. This will determine where your endpoints are located on your `easyAPI`. |
| methods | Object | A key/value mapping of all methods associated to this endpoint. The key represents the property that will be accessed on your `easyAPI`, and the value represents the method type (i.e. GET, POST, PUT, etc).  |

Here's an example of an `Endpoint`:

```javascript
{
    "namespace": "todo",
    "methods": {
        "getTodo": "GET",
        "updateTodo": "POST"
    }
}
```

### Sample `API`

Below is a full example of a valid `API` JSON Object that can be converted into an `easyAPI`:

```javascript
{
    "host": "localhost",
    "protocol": "http",
    "endpoints": {
        "/login": {
            "namespace": "auth",
            "methods": {
                "authenticate": "POST"
            }
        },

        "/todos/{id}": {
            "namespace": "todo",
            "methods": {
                "updateTodo": "POST",
                "getTodo": "GET"
            }
        },

        "/todos/list": {
            "namespace": "todo",
            "methods": {
                "listTodos": "GET"
            }
        }
    }
}
```

## Configuring your Easy API with the `easyAPIProvider`

Once your `API` JSON Object is constructed, the last step is to pass your `API` into the `easyAPIProvider`. You can do this by using `angular.module.config`.

```javascript
angular
    .module('myApp', ['easyAPI'])
    .config(function(easyAPIProvider) {
        // Set up your API Object (as shown above).
        var api = {};

        // Pass your API Object to the provider.
        easyAPIProvider.setJSON(api);
    });
```

... and you're good to go! You're now ready to start using your `easyAPI`.

## Triggering requests with `easyAPI`

Once your Easy API is all set up, endpoints can be accessed from `easyAPI`, which can be injected into your controllers and services.

`easyAPI` is constructed using your `API` JSON Object. It uses the namespaces, endpoints and methods that you declared to construct an Object that can be used to trigger HTTP requests.

For example, the following `API` JSON Object:

```javascript
{
    "host": "localhost",
    "protocol": "http",
    "endpoints": {
        "/login": {
            "namespace": "auth",
            "methods": {
                "authenticate": "POST"
            }
        },

        "/todo/{id}": {
            "namespace": "todo",
            "methods": {
                "getTodo": "GET",
                "updateTodo": "POST"
            }
        },

        "/todo/list": {
            "namespace": "todo",
            "methods": {
                "listTodos": "GET"
            }
        }
    }
}
```
... will create an `easyAPI` with the following structure:

```javascript
{
    "auth": {
        "authenticate": <function>
    },

    "todo": {
        "getTodo": <function>,
        "updateTodo": <function>,
        "listTodos": <function>
    }
}
```

We can then trigger HTTP requests using our `easyAPI`:

```javascript
angular
    .module('myApp', ['easyAPI'])
    .controller('todoCtrl', todoCtrl);

function todoCtrl(easyAPI) {

    var vm = this;
    vm.list = list;
    vm.get = get;
    vm.update = update;

    function list() {
        // Trigger a GET request to http://localhost/todo/list
        easyAPI.todo.listTodos()
            .then(function(response) {

            });
    }

    function get() {
        var data = {
            id: 123
        };

        // Trigger a GET request to http://localhost/todo/123
        easyAPI.todo.getTodo(data)
            .then(function(response) {

            });
    }

    function update() {
        var data = {
            id: 123
        };

        // Trigger a POST request to http://localhost/todo/123
        easyAPI.todo.updateTodo(data)
            .then(function(response) {

            });
    }

}
```

As seen above, each property maps to a function which triggers an HTTP request to it's associated endpoint, and returns a `Promise`:

`easyAPI[namespace][operationId]([data], [config])`

| Param | Type | Description |
|--------|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `data` | Object | Optional. A key/value mapping that represents data to be passed to the server. |
| `config` | Object | Optional. A key/value mapping to add extra configuration properties to the HTTP request. See Angular's `$http` service [`config` Object](https://docs.angularjs.org/api/ng/service/$http#usage) for more information.  |

## Author

### Tushar Ghate

+ [http://www.tusharghate.com](http://www.tusharghate.com)
+ [http://github.com/tusharghate](http://github.com/tusharghate)

## License

```
The MIT License (MIT)

Copyright (c) 2016 Tushar Ghate

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
