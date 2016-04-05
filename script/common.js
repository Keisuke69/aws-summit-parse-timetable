function truncate(node){
  var location = ''
  if(node.mark.substr(0,1) == 'P'){
    location = node.mark.substr(1,2);
  } else {
    location = node.mark.substr(1,1);
  }
  return {
    type: node.mark.substr(0,1),
    title: node.name, 
    description: node.description, 
    start_time: node.start, 
    end_time: node.end, 
    key: node.mark, 
    location: location, 
    slot: node.mark.substr(node.mark.length - 4, 4),
    vacancy: node.vacancy
  };
}

function sort_by_location(object){
  for ( var k in object){
    object[k].sort(function(a,b){
      if(a.location.substr(1,1)<b.location.substr(1,1)) return -1;
      if(a.location.substr(1,1)>b.location.substr(1,1)) return 1;
      return 0;
    });       
  }
}

function to_double_digits(number) {
  number += "";
  if (number.length === 1) {
    number = "0" + number;
  }
 return number;     
};

function sort_by_time(object){
      var key = [];
      for ( var k in object){
        key.push(k);
      }

      key.sort(function(a,b){
        if(a<b) return -1;
        if(a>b) return 1;
        return 0;
      });
      
      var temp = new Object();
      key.map(function(k){
        temp[k] = object[k];
        return temp;
      })
      return temp;
}
