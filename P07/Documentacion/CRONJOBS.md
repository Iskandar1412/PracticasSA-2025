* Ver estado Cronjob

```sh
kubectl get cronjob -n proyecto-sa
```

* Ver jobs generados

```sh
kubectl get jobs -n proyecto-sa
```

* Ver estado del job generado

```sh
kubectl describe job cronjob-fecha-xxxxxx -n proyecto-sa
```

* Ver pods/logs

```sh
kubectl get pods -n proyecto-sa --selector=job-name=cronjob-fecha-xxxxxx

kubectl logs nombre-del-pod -n proyecto-sa
```

> puedes obtener el pod directamente con 

```sh
kubectl logs -n proyecto-sa -l job-name=cronjob-fecha --tail=100
```

* Ver errores de imagen

```sh
kubectl describe pod nombre-del-pod -n proyecto-sa
```

* Ver todos los jobs creados por un Cronjob específico

```sh
kubectl get jobs -n proyecto-sa --sort-by=.metadata.creationTimestamp
```

> Crear un Cronjob (Recordar que el `cronjob-fecha` es como se llama el servicio por decirlo así y lo otro `cronjob-fecha-manual-1` es cualquier nombre)

```sh
kubectl create job --from=cronjob/cronjob-fecha cronjob-fecha-manual-1 -n proyecto-sa
```