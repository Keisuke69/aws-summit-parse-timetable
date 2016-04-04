var Timetable = React.createClass({
  getInitialState: function() {
    return {
      result: []
    };
  },

  componentDidMount: function() {
    this.serverRequest = $.get(this.props.source, function (result) {

      var output = result.event_dates[0].timetables;

      var day2 = new Object();
      var day3 = new Object();;

      output.map(function(node){
        var date = new Date(Date.parse(node.start)).getDate();

        if(date == 2 && node.mark.substr(0,1) == 'H'){
          if(node.mark.substr(0,1) == 'H'){
            node = truncate(node);
            if(day2[node.slot]){
              day2[node.slot].push(node);
            }else{
              day2[node.slot] = [];
              day2[node.slot].push(node);
            }
          } 
        } else if(date == 3 && node.mark.substr(0,1) == 'H') {
          if(node.mark.substr(0,1) == 'H'){
            node = truncate(node);
            if(day3[node.slot]){
              day3[node.slot].push(node);
            }else{
              day3[node.slot] = [];
              day3[node.slot].push(node);
            }
          } 
        }
      })

      var day2_key = [];
      for ( var k in day2){
        day2_key.push(k);
      }

      day2_key.sort(function(a,b){
        if(a<b) return -1;
        if(a>b) return 1;
        return 0;
      });
      
      var temp = new Object();
      day2_key.map(function(key){
        temp[key] = day2[key];
        return temp;
      })

      day2 = temp;

      var day3_key = [];
      for ( var k in day3){
        day3_key.push(k);
      }

      day3_key.sort(function(a,b){
        if(a<b) return -1;
        if(a>b) return 1;
        return 0;
      });
      
      var temp = new Object();
      day3_key.map(function(key){
        temp[key] = day3[key];
        return temp;
      })
      
      day3 = temp;
      
      for ( var k in day2){
        day2[k].sort(function(a,b){
          if(a.location<b.location) return -1;
          if(a.location>b.location) return 1;
          return 0;
        });       
      }

      for ( var k in day3){
        day3[k].sort(function(a,b){
          if(a.location<b.location) return -1;
          if(a.location>b.location) return 1;
          return 0;
        });       
      }

      this.setState({
        day2: day2,
        day3: day3
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function() {
    var day2_row = [];
    var day3_row = []


    for( var slot in this.state.day2){
      day2_row.push(<Member nodes={this.state.day2[slot]} time={slot}></Member>);
    }

    for( var slot in this.state.day3){
      day3_row.push(<Member nodes={this.state.day3[slot]} time={slot}></Member>);
    }

    return (
      <div>
        <h1>2日目</h1>
        <table className='timetable'>
          <tr>
            <th></th>
            <th>HA1320</th>
          </tr>
          {day2_row}
        </table>
        <h1>3日目</h1>
        <table className='timetable'>
          <tr>
            <th></th>
            <th>HA: DevCon-Use Case Track</th>
            <th>HB: DevCon-Tech Track</th>
            <th>HC: DevCon-IoT Track</th>
          </tr>
          {day3_row}
        </table>
      </div>
    );
  }
});

var Member = React.createClass({
  render: function() {
    var memberNodes = this.props.nodes.map(function(node){
      return <td>{node.title}</td>
    })

    return (
      <tr>
        <td>{this.props.time}</td>
        {memberNodes}
      </tr>
    );
  }
});

ReactDOM.render(
  <Timetable source="https://u92s86x8g3.execute-api.ap-northeast-1.amazonaws.com/prod/v/2/timetable/get" />,
  document.getElementById('app')
  );







