# BFX Simple Exchange

Install Grape:

```
npm i -g grenache-grape
```

Start 2 Grapes:

```
grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
```

Boot the server:

```
node server.js
```


After starting the server and grape, run:

```
node client.js
```

Once Both Server and Client are running, run:

```
node lib/put_order.js
```

The above function returns a hash, and the order ID

If you want to get the order, run:

```
node lib/get_order.js ${orderHash}
```


### TO DO

1) Promisify the code

