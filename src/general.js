var Timetable = React.createClass({
  getInitialState: function() {
    return {
      result: [],
      showDetail: false
    };
  },

  componentDidMount: function() {
    this.serverRequest = $.get(this.props.source, function (result) {

      var output = result.event_dates[0].timetables;
      var day2 = new Object();
      var day3 = new Object();;

      output.map(function(node){
        var dateObj = new Date(Date.parse(node.start));
        dateObj.setUTCHours(dateObj.getUTCHours() + 9);
        
        var date = dateObj.getUTCDate();

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

      day2 = sort_by_time(day2);
      day3 = sort_by_time(day3);
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

  openDetail: function(a,b,c,d){
    //console.log('openDetail clicked')
    // var start = new Date(Date.parse(c.start_time));
    // var end = new Date(Date.parse(c.end_time));
    // var start_end_time=String(start.getHours())+ ":" + String(to_double_digits(start.getMinutes())) + " ～ " + String(end.getHours())+ ":" + String(to_double_digits(end.getMinutes()));


    var start = new Date(Date.parse(c.start_time));
    start.setUTCHours(start.getUTCHours() + 9);

    var end = new Date(Date.parse(c.end_time));
    end.setUTCHours(end.getUTCHours() + 9);

    var start_end_time=String(start.getUTCHours())+ ":" + String(to_double_digits(start.getMinutes())) + " ～ " + String(end.getUTCHours())+ ":" + String(to_double_digits(end.getMinutes()));

    this.setState({
      detail_title: c.title,
      detail_description: c.description,
      detail_start_end_time: start_end_time,
      showDetail: true
    });
  },

  closeDetail: function(){
    console.log('closeDetail clicked')
    this.setState({
      showDetail: false
    });
  },

  render: function() {
    var day2_row = [];
    var day3_row = []
    for( var k in this.state.day2){
      day2_row.push(<Member nodes={this.state.day2[k]} time={k} openDetail={this.openDetail}></Member>);
    }

    for( var k in this.state.day3){
      day3_row.push(<Member nodes={this.state.day3[k]} time={k} openDetail={this.openDetail}></Member>);
    }

    return (
      <div>
        { this.state.showDetail ? <Detail title={this.state.detail_title} description={this.state.detail_description} start_end_time={this.state.detail_start_end_time} closeDetail={this.closeDetail}/> : null }
        <h3 className='title mb20 mt40' id="0602">6 月 2 日（木） タイムテーブル<span className='t12 small normal_t'>　※敬称略</span></h3>
        <table className='timetable'>
          <tbody>
          <Header day="2"/>
          {day2_row}
          </tbody>
        </table>
        <h3 className='title mb20 mt40' id="0603">6 月 3 日（金） タイムテーブル<span className='t12 small normal_t'>　※敬称略</span></h3>
        <table className='timetable'>
          <tbody>
          <Header  day="3"/>
          {day3_row}
          </tbody>
        </table>
      </div>
    );
  }
});

var Header = React.createClass({
  render: function(){
    var track_f = ""
    if(this.props.day==2){
      track_f = "F: Entry Track"
    }else{
      track_f = "F: Public Sector Track"
    }
        return <tr>
            <th className="time">開始時刻</th>
            <th className="track a">A:IT Transformation Track</th>
            <th className="track b">B: Media & Entertainment Track</th>
            <th className="track c">C: Basic Tech Track</th>
            <th className="track d">D: Advanced Tech Track</th>
            <th className="track e">E: SMB Track</th>
            <th className="track f">{track_f}</th>
            <th className="track g">G: Self-Paced Lab Session</th>
          </tr>;
  }
})

var Member = React.createClass({

  _onClick: function(a,b,c,d){
    this.props.openDetail(a,b,c,d);
  },

  render: function() {
    var memberNodes = [];
    for(var i = 0; i <7; i++){
      no_vacancy = "";
      if(this.props.nodes[i]){
        if(parseInt(this.props.nodes[i].vacancy) < 1){
          no_vacancy =' [受付終了]'
        }
        memberNodes.push(<td className="session"><span className="code">{this.props.nodes[i].key}</span><span className="full">{no_vacancy}</span><br /><p className="title"><a href="#!" onClick={this._onClick.bind(this,this.props.time,i,this.props.nodes[i])}>{this.props.nodes[i].title}</a></p></td>);
      }else{
        memberNodes.push(<td className="nosession">-</td>);
      }
    }

    var date = this.props.time.substr(0,2) + ":" + this.props.time.substr(2,2) + "～";
    return (
      <tr>
        <td className = "date">{date}</td>
        {memberNodes}
      </tr>
    );
  }
});

var Detail = React.createClass({
  _onClick: function(){
    this.props.closeDetail();
  },
 render: function(){
   return <div id="modal-open" className="modal-window">
            <div className="modal-inner">
            <div className="start-end-time" id="modal-start-end-time">{this.props.start_end_time}</div>
            <div className="title" id="modal-title">{this.props.title}</div>
            <div className="description" id="modal-description" dangerouslySetInnerHTML={{__html: this.props.description}} />
            <div className="btn" id="modal-register-btn"><a className="button modal_btn" href="register.html">お申し込みはこちら 》</a></div>
          </div>
          <div id="modal-close-btn"><a className="modal-close" href="#!" onClick={this._onClick}>✕</a></div>
          </div>;
   }
})

ReactDOM.render(
  <Timetable source="https://api.eventregist.com/v/2/timetable/get?event_uid=83a0463013e6efe64f7a024dba8f056e" />,
  document.getElementById('react-timetable')
  );








