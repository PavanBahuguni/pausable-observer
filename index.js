// Normal data stream to which you want to subscribe.
const normalObservable$ = Rx.Observable.create(observer => {
  let i=0;
  setInterval(function(){
    observer.next(i);
    i++
  }, 1000);
})

// Data stream which emits event of pause, on which normalObservable$ should pause its data emission.
const shouldObservableBePaused$ = Rx.Observable.create(observer => {

  //Initially we emit true so that normalObservable$ is returned and data stream is started on subscription. 
  setTimeout(function(){
      observer.next(true);
  }, 1000);
  
  //After 5 seconds we emit false so that normalObservable$ is paused to the subscriber
  setTimeout(function(){
      observer.next(false);
  }, 5000);
  
  //After 10 seconds we emit false so that normalObservable$ restarts its data emission to the subscriber
  setTimeout(function(){
      observer.next(true);
  }, 10000);
  
})

/*
Swicth map is used to return the desired observable, based on data being emitted on the shouldObservableBePaused$.
When there is a true event we retrn a silent observable, which doeant emit any data.
WHen there is a false event we return our normalObservable$, to which we really want to subscribe.
And swicthmap always takes the latest observable.
*/
const pausableObserverable$ = shouldObservableBePaused$.
                  switchMap(function(pause){
                    if(!pause){
                        return Rx.Observable.never();
                    } else{
                        return normalObservable$;
                    }
                  });
pausableObserverable$.subscribe(res=>console.log(res));
