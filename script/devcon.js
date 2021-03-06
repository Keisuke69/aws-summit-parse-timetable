var Timetable = React.createClass({
  displayName: 'Timetable',

  getInitialState: function () {
    return {
      result: [],
      showDetail: false
    };
  },

  componentDidMount: function () {
    this.serverRequest = $.get(this.props.source, function (result) {

      var output = result.event_dates[0].timetables;
      var day2 = new Object();
      var day3 = new Object();;

      output.map(function (node) {
        var dateObj = new Date(Date.parse(node.start));
        dateObj.setUTCHours(dateObj.getUTCHours() + 9);

        var date = dateObj.getUTCDate();

        if (date == 2 && node.mark.substr(0, 1) == 'H') {
          if (node.mark.substr(0, 1) == 'H') {
            node = truncate(node);
            if (day2[node.slot]) {
              day2[node.slot].push(node);
            } else {
              day2[node.slot] = [];
              day2[node.slot].push(node);
            }
          }
        } else if (date == 3 && node.mark.substr(0, 1) == 'H') {
          if (node.mark.substr(0, 1) == 'H') {
            node = truncate(node);
            if (day3[node.slot]) {
              day3[node.slot].push(node);
            } else {
              day3[node.slot] = [];
              day3[node.slot].push(node);
            }
          }
        }
      });

      day2 = sort_by_time(day2);
      day3 = sort_by_time(day3);
      sort_by_location(day2);
      sort_by_location(day3);

      this.setState({
        day2: day2,
        day3: day3
      });
    }.bind(this));
  },

  componentWillUnmount: function () {
    this.serverRequest.abort();
  },

  openDetail: function (a, b, c, d) {
    // console.log('openDetail clicked')
    // var start = new Date(Date.parse(c.start_time));
    // var end = new Date(Date.parse(c.end_time));
    // var start_end_time=String(start.getHours())+ ":" + String(to_double_digits(start.getMinutes())) + " ～ " + String(end.getHours())+ ":" + String(to_double_digits(end.getMinutes()));

    var start = new Date(Date.parse(c.start_time));
    start.setUTCHours(start.getUTCHours() + 9);

    var end = new Date(Date.parse(c.end_time));
    end.setUTCHours(end.getUTCHours() + 9);

    var start_end_time = String(start.getUTCHours()) + ":" + String(to_double_digits(start.getMinutes())) + " ～ " + String(end.getUTCHours()) + ":" + String(to_double_digits(end.getMinutes()));

    this.setState({
      detail_title: c.title,
      detail_description: c.description,
      detail_start_end_time: start_end_time,
      showDetail: true
    });
  },

  closeDetail: function () {
    console.log('closeDetail clicked');
    this.setState({
      showDetail: false
    });
  },

  render: function () {
    var day2_row = [];
    var day3_row = [];
    for (var k in this.state.day2) {
      day2_row.push(React.createElement(Member, { nodes: this.state.day2[k], time: k, openDetail: this.openDetail }));
    }

    for (var k in this.state.day3) {
      day3_row.push(React.createElement(Member, { nodes: this.state.day3[k], time: k, openDetail: this.openDetail }));
    }

    return React.createElement(
      'div',
      null,
      this.state.showDetail ? React.createElement(Detail, { title: this.state.detail_title, description: this.state.detail_description, start_end_time: this.state.detail_start_end_time, closeDetail: this.closeDetail }) : null,
      React.createElement(
        'h3',
        { className: 'title mb20 mt40', id: '0602' },
        '6 月 2 日（木） タイムテーブル',
        React.createElement(
          'span',
          { className: 't12 small normal_t' },
          '　※敬称略'
        )
      ),
      React.createElement(
        'table',
        { className: 'timetable' },
        React.createElement(
          'tbody',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              { className: 'time' },
              '時間'
            ),
            React.createElement(
              'th',
              { className: 'track_dev1 dev' },
              'DevCon'
            )
          ),
          day2_row
        )
      ),
      React.createElement(
        'h3',
        { className: 'title mb20 mt40', id: '0603' },
        '6 月 3 日（金） タイムテーブル',
        React.createElement(
          'span',
          { className: 't12 small normal_t' },
          '　※敬称略'
        )
      ),
      React.createElement(
        'table',
        { className: 'timetable' },
        React.createElement(
          'tbody',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              { className: 'time' },
              '時間'
            ),
            React.createElement(
              'th',
              { className: 'track_dev2 dev' },
              'DevCon-Use Case Track'
            ),
            React.createElement(
              'th',
              { className: 'track_dev2 dev' },
              'DevCon-Tech Track'
            ),
            React.createElement(
              'th',
              { className: 'track_dev2 dev' },
              'DevCon-IoT Track'
            )
          ),
          day3_row
        )
      )
    );
  }
});

var Member = React.createClass({
  displayName: 'Member',


  _onClick: function (a, b, c, d) {
    this.props.openDetail(a, b, c, d);
  },

  render: function () {
    var memberNodes = [];
    for (var i = 0; i < this.props.nodes.length; i++) {
      no_vacancy = "";
      if (this.props.nodes[i]) {
        if (parseInt(this.props.nodes[i].vacancy) < 1) {
          no_vacancy = ' [受付終了]';
        }
        memberNodes.push(React.createElement(
          'td',
          { className: 'session' },
          React.createElement(
            'span',
            { className: 'code' },
            this.props.nodes[i].key
          ),
          React.createElement(
            'span',
            { className: 'full' },
            no_vacancy
          ),
          React.createElement('br', null),
          React.createElement(
            'p',
            { className: 'title' },
            React.createElement(
              'a',
              { href: '#!', onClick: this._onClick.bind(this, this.props.time, i, this.props.nodes[i]) },
              this.props.nodes[i].title
            )
          )
        ));
      } else {
        memberNodes.push(React.createElement(
          'td',
          { className: 'nosession' },
          '-'
        ));
      }
    }

    var date = this.props.time.substr(0, 2) + ":" + this.props.time.substr(2, 2) + "～";
    return React.createElement(
      'tr',
      null,
      React.createElement(
        'td',
        { className: 'date' },
        date
      ),
      memberNodes
    );
  }
});

var Detail = React.createClass({
  displayName: 'Detail',

  _onClick: function () {
    this.props.closeDetail();
  },
  render: function () {
    return React.createElement(
      'div',
      { id: 'modal-open', className: 'modal-window' },
      React.createElement(
        'div',
        { className: 'modal-inner' },
        React.createElement(
          'div',
          { className: 'start-end-time', id: 'modal-start-end-time' },
          this.props.start_end_time
        ),
        React.createElement(
          'div',
          { className: 'title', id: 'modal-title' },
          this.props.title
        ),
        React.createElement('div', { className: 'description', id: 'modal-description', dangerouslySetInnerHTML: { __html: this.props.description } }),
        React.createElement(
          'div',
          { className: 'btn', id: 'modal-register-btn' },
          React.createElement(
            'a',
            { className: 'button modal_btn', href: 'register.html' },
            'お申し込みはこちら 》'
          )
        )
      ),
      React.createElement(
        'div',
        { id: 'modal-close-btn' },
        React.createElement(
          'a',
          { className: 'modal-close', href: '#!', onClick: this._onClick },
          '✕'
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(Timetable, { source: 'https://api.eventregist.com/v/2/timetable/get?event_uid=83a0463013e6efe64f7a024dba8f056e' }), document.getElementById('react-timetable'));