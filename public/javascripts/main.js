$(document).ready(function() {
  if (localStorage.getItem('lastTab') == 'null') {
    localStorage.setItem("lastTab", 1);
  }
  loadTabs(localStorage.getItem('lastTab'));
  M.AutoInit();
  $('.modal').modal();
  $('.result').each(function(index) {
    $(this).parents('td').addClass('resulttd');
    if (!$(this).text().includes("running")) {
      //  console.log($(this).text());
      let scoreTeam1 = parseInt($(this).text().charAt(0));
      let scoreTeam2 = parseInt($(this).text().charAt(4));

      let resultTeam1 = parseInt($(this).parents('td').siblings('td').children('p')[0].innerText);
      let resultTeam2 = parseInt($(this).parents('td').siblings('td').children('p')[1].innerText);

      let points = 0;

      if (scoreTeam1 == resultTeam1 && scoreTeam2 == resultTeam2) {
        points = 3;
        $(this).append("<span class='red-text'> +" + points + "</span>");
      } else if (scoreTeam1 - scoreTeam2 == resultTeam1 - resultTeam2) {
        points = 2;
        $(this).append("<span class='orange-text'> +" + points + "</span>");
      } else if (Math.sign(scoreTeam1 - scoreTeam2) === Math.sign(resultTeam1 - resultTeam2)) {
        points = 1;
        $(this).append("<span class='yellow-text'> +" + points + "</span>");
      } else {
        $(this).append("<span class='black-text'> +" + points + "</span>");
      }
    } else {
      $(this).text("Live!");
    }
    $(this).parents('td').append("<a class='waves-effect waves-light btn-floating modalTrigger'><i class='material-icons'>search</i></a>")

  });

  $(document).on('click', '.modalTrigger', function(e) {
    let matchID = $(this).parents('td').parents('tr').index('.gameday tr');
    let url = '/users/tip/' + matchID;
    let trigger = $(this);
    $.ajax({
      type: "get",
      url: url,
    }).done(function(tips) {
      let modalcontent = "";
      tips.forEach(function(tip) {
        modalcontent += "<tr><td>" + tip.username + "</td><td>" + tip.scoreTeam1 + " : " + tip.scoreTeam2 + "</td><td class='tpoints'>" + tip.points + "</td></tr>";
        $('#modalcontent').html(modalcontent);
      });
      let modalheader = trigger.siblings('.result').text().substring(0, 5);;
      $('#modalheader').text(modalheader);
      if (modalheader != "Live!") {
        sortTable('modalTable');
      } else {
        $('.tpoints').hide();
      }
      $('.modal').modal('open');
    }).fail(function() {
      console.log("fail");
    });


  });


  $(document).on('click', '.tipsubmit', function(e) {

    console.log("submit");
    let scoreTeam1 = $(this).parents('td').siblings('td').children('input')[0].value;
    let scoreTeam2 = $(this).parents('td').siblings('td').children('input')[1].value;
    let matchID = $(this).parents('td').parents('tr').index('.gameday tr');
    console.log(matchID);
    if (scoreTeam1 != "" && scoreTeam2 != "" && matchID != null && (typeof parseInt(scoreTeam1) === "number") && Math.floor(parseInt(scoreTeam1)) === parseInt(scoreTeam1) && (typeof parseInt(scoreTeam2) === "number") && Math.floor(parseInt(scoreTeam2)) === parseInt(scoreTeam2)) {
      let bet = {
        scoreTeam1: scoreTeam1,
        scoreTeam2: scoreTeam2
      };
      let url = '/users/tip/' + matchID;
      $.ajax({
        type: "put",
        url: url,
        data: bet,
      }).done(function() {
        location.reload();
      })
    } else {
      location.reload();
    }
  })

  $('.tipedit').on('click', function(e) {
    console.log("edit");
    $(this).parents('td').siblings('td').children('p').replaceWith("<input type='number'>");
    $(this).replaceWith("<a class='btn-floating waves-effect waves-light red tipsubmit tipbutton'><i class='material-icons'>done</i></a>");
  });

  $('.daytoggle').on('click', function(e) {
    let day = $(this).attr('id').slice(-1);
    loadTabs(day);
  });

  $('#matchSubmit').on('click', function(e) {
    e.preventDefault();
    console.log("Match");
    let url = '/admin/match/' + $('#matchID').val();
    let data = {
      scoreTeam1: $('#scoreTeam1').val(),
      scoreTeam2: $('#scoreTeam2').val()
    };
    $.ajax({
      type: "put",
      url: url,
      data: data,
    }).done(function() {
      location.reload();
    })

  });

  $('#championsubmit').on('click', function(e) {
    let selected = $('#championselect').val();
    if (selected != null) {
      let champion = $('#championselect').find(":selected").text();
      let url = '/users/champion/' + champion;
      $.ajax({
        type: "put",
        url: url,
      }).done(function() {
        location.reload();
      })
    }

  });


  function loadTabs(day) {
    $('.gameday').hide();
    $('#day' + day).show();
    $('.daytoggle').removeClass('active');
    $('#d' + day).addClass('active');
    localStorage.setItem("lastTab", day);
  }

  function sortTable(table) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById(table);
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.getElementsByTagName("TR");
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[2];
        y = rows[i + 1].getElementsByTagName("TD")[2];
        // Check if the two rows should switch place:
        if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }


})