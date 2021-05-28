function createMemory(number, limit) {
  var memory = Object.create(bucketsProtoType);
  memory.N = number;
  memory.max = limit;
  memory.clear();
  return memory;
}

var bucketsProtoType = {
  clear: function clear() {
      this.size = 0;
      this.buckets = [];
      for (var i = 0; i < this.N; i++) {
          this.spawnBucket();
      }
  },
  spawnBucket: function spawnBucket() {
      this.buckets.unshift(new Map());
  },
  rotateBuckets: function rotateBuckets() {
      var dropped = this.buckets.pop();
      this.spawnBucket();
      this.size = 0;
      if (this.rotationHook) {
          this.rotationHook(dropped);
      }
  },
  set: function set(key, value) {
      if (!(this.buckets[0].has(key))) {
          this.size++;
          if (this.max && this.size >= Math.ceil(this.max / this.buckets.length)) {
              this.rotateBuckets();
          }
      }
      this.buckets[0].set(key, value);
      return value;
  },
  get: function get(key) {
      for (var i = 0; i < this.buckets.length; i++) {
          if (this.buckets[i].has(key)) {
              //todo: this should be configurable
              if (i) {
                  //put a reference in the newest bucket
                  return this.set(key, this.buckets[i].get(key));
              }
              return this.buckets[i].get(key);
          }
      }
  }
}

function memoryCache(opts) {
      var buckets = ~~(opts.buckets) || 2;
      var mem = createMemory(buckets, opts.limit);
      mem.rotationHook = opts.cleanupListener || null;

      if (opts.maxTTL) {
          var intervalHandle = setInterval(mem.rotateBuckets.bind(mem), ~~(opts.maxTTL / buckets));
      }

      return {
          set: mem.set.bind(mem),
          get: mem.get.bind(mem),
          clear: mem.clear.bind(mem),
          destroy: () => {
              clearInterval(intervalHandle);
          },
          _get_buckets:  () => {
              return mem.buckets;
          },
          _rotate_buckets:  () => {
              return mem.rotateBuckets();
          }
      }
  }

module.exports =  memoryCache;