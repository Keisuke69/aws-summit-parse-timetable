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

        if(date == 2 && node.mark.substr(0,1) == 'P'){
          if(node.mark.substr(0,1) == 'P'){
            node = truncate(node);
            if(day2[node.slot]){
              day2[node.slot].push(node);
            }else{
              day2[node.slot] = [];
              day2[node.slot].push(node);
            }
          } 
        } else if(date == 3 && node.mark.substr(0,1) == 'P') {
          if(node.mark.substr(0,1) == 'P'){
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


      // var day2_key = [];
      // for ( var k in day2){
      //   day2_key.push(k);
      // }

      // day2_key.sort(function(a,b){
      //   if(a<b) return -1;
      //   if(a>b) return 1;
      //   return 0;
      // });
      
      // var temp = new Object();
      // day2_key.map(function(key){
      //   temp[key] = day2[key];
      //   return temp;
      // })

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

      sort_by_location(day2)
      sort_by_location(day3)


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
    for( var k in this.state.day2){
      day2_row.push(<Member nodes={this.state.day2[k]} time={k}></Member>);
    }

    for( var k in this.state.day3){
      day3_row.push(<Member nodes={this.state.day3[k]} time={k}></Member>);
    }

    var header_row = <Header></Header>;

    return (
      <div>
        <h1>2日目</h1>
        <table className='timetable'>
          {header_row}
          {day2_row}
        </table>
        <h1>3日目</h1>
        <table className='timetable'>
          {header_row}
          {day3_row}
        </table>
      </div>
    );
  }
});

var Header = React.createClass({
  render: function(){
        return <tr>
            <th className="time">開始時刻</th>
            <th className="track a">A:IT Transformation Track</th>
            <th className="track b">B: Media & Entertainment Track</th>
            <th className="track c">C: Basic Tech Track</th>
            <th className="track d">D: Advanced Tech Track</th>
            <th className="track e">E: SMB Track</th>
            <th className="track f">F: Entry Track</th>
            <th className="track g">G: Self-Paced Lab Session</th>
          </tr>;
  }
})

var Member = React.createClass({

  openDetail: function(a,b,c,d){
    var start = new Date(Date.parse(this.props.nodes[b].start_time));
    var end = new Date(Date.parse(this.props.nodes[b].end_time));

    document.getElementById('modal-open').style.display='block';
    document.getElementById('modal-open').style.opacity=1;
    document.getElementById('modal-open').style.transform='translate(0px, 0px)';
    document.getElementById('modal-title').innerHTML=this.props.nodes[b].title;
    document.getElementById('modal-description').innerHTML=this.props.nodes[b].description;
    document.getElementById('modal-start-end-time').innerHTML=String(start.getHours())+ ":" + String(to_double_digits(start.getMinutes())) + " - " + String(end.getHours())+ ":" + String(to_double_digits(end.getMinutes()));
    document.getElementById('modal-register-btn').innerHTML='<a class="button modal_btn" href="register.html">《 お申し込みはこちら 》</a>'
    document.getElementById('modal-close-btn').innerHTML='<a class="modal-close" href="#!" onClick="close_detail()">✕</a>'
  },

  render: function() {
    var memberNodes = [];
    var no_vacancy;
    for(var i = 0; i <7; i++){
      if(this.props.nodes[i]){
        if(parseInt(this.props.nodes[i].vacancy) < 500){
          no_vacancy =' [選択不可]'
        }
        memberNodes.push(<td className="session"><span className="code">{this.props.nodes[i].key}</span><span className="full">{no_vacancy}</span><br /><p className="title"><a href="#" onClick={this.openDetail.bind(this,this.props.time,i)}>{this.props.nodes[i].title}</a></p></td>);
      }else{
        memberNodes.push(<td className="nosession">-</td>);
      }
    }

    var date = this.props.time.substr(0,2) + ":" + this.props.time.substr(2,2);
    return (
      <tr>
        <td className = "date">{date}</td>
        {memberNodes}
      </tr>
    );
  }
});



ReactDOM.render(
  <Timetable source="https://u92s86x8g3.execute-api.ap-northeast-1.amazonaws.com/prod/v/2/timetable/get" />,
  //<Timetable source="https://api.eventregist.com/v/2/timetable/get?event_uid=83a0463013e6efe64f7a024dba8f056e" />,
  document.getElementById('app')
  );







