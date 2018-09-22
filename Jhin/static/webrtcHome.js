var contactsList = {
    header : "Rooms",
    view : "list",
    id : "contactsList",
    template : `
		<div class='contactPaneDiv'>
			<img class="contactIcon" src="#img#"/>
			<span class="contactTextDiv">#title#</span>
		</div>
	`,
    item : {
        height: 80,
        width: 300,
    },
    select:true, scroll:false,
    on:{ onBeforeSelect: (id) => doCall(id) }
};
//config admin
var config = {
    server:"/",
    users:function(room, people, me){
        var list = $$("contactsList");
        list.clearAll();
        if (config.name){
            if( getQueryVariable("room")!=false){
                list.add({
                id:-1,
                    img:"images/admin.png",
                    title:"Admin "+ config.name + " ( this is Me )" });
            }else{
                list.add({
                    id:-1,
                    img:"images/avatar.jpg",
                    title: config.name + " ( this is Me )" });
            }
        }

        for (var key in people){
            var v = people[key];
                list.add ({
                    id: v.easyrtcid,
                    img: "images/avatar.jpg",
                    title: v.username
                });

        }

    }

};
// config users
var chat = {
    css:"absarea",
    template:`<div class='mirrorDiv'><video id='mirrorVideo' width></div><br>
				<div class='windowToUniverseDiv'><video id='windowToUniverse'></div><br>
                <div class='windowToUniverseDiv1'><video id='windowToUniverse1'></div>
                <div class='windowToUniverseDiv2'><video id='windowToUniverse2'></div>
                <div class='windowToUniverseDiv3'><video id='windowToUniverse3'></div>`
};
if(config.room!=null){
    $$("Rooom").setValue("Room : "+config.room);
    easyrtc.joinRoom(config.room,  null, null, null);
}else{
   // $$("Rooom").setValue("Room : Salon");
}

function doConnect(config) {

    //set the dimensions of the local camera
    easyrtc.setVideoDims(640,480);
    //Sets the user name associated with the connection.
    easyrtc.setUsername (config.name);
    //This method allows you to join a single room
    easyrtc.joinRoom(config.room,  null, null, null);
    if(sessionStorage.getItem('room')!=null){
        console.log('ble');
        easyrtc.enableMicrophone(false);
    }
    easyrtc.setRoomOccupantListener(config.users);

    //Sets the url of the Socket server.
    easyrtc.setSocketUrl(config.server);
   // easyrtc.connect("easyrtc.instantMessaging");
    easyrtc.easyApp("WebixWebRTC", "mirrorVideo", ["windowToUniverse","windowToUniverse1","windowToUniverse2","windowToUniverse3",], function(id){
        config.$userId = id
    }, function(code){

        var text = "Connection failed";
        if(code === "MEDIA_ERR") text += ". Cannot find a local web camera";
        if(code === "MEDIA_WARNING") text += ". Video width and height are inappropriate";
        if(code === "SYSTEM_ERR") text += ". Check your network settings";
        if(code === "ALREADY_CONNECTED") text += ". You are already connected";

        webix.message({ type:"error", text: text});
    });



    easyrtc.setPeerClosedListener(function(){
        if ($$("endcall").isVisible()){
            $$("endcall").hide();
            $$("status").setValue("");
            webix.message("You were disconnected");
        }
    });
    easyrtc.setAcceptChecker(

        function(caller, cb) {
        var name = easyrtc.idToName(caller);
        if(name==sessionStorage.getItem('room')){
            window.location.replace('/?name='+getQueryVariable("name")+'&room='+name);
            sessionStorage.clear();
        }
        var callback = function(wasAccepted) {
            if( wasAccepted){
                if (easyrtc.getConnectionCount() > 1 )
                    easyrtc.hangupAll();
                $$("endcall").show();
                $$("status").setValue(name);
                console.log('dd');
                if(sessionStorage.getItem('room')!=null){
                    console.log('ble');
                    easyrtc.enableMicrophone(false);
                }
            }
            cb(wasAccepted);
        };

        if( easyrtc.getConnectionCount() > 1 )
            webix.confirm({ text:"Drop the current call and accept the new one from " + name + " ?", callback });
        else
            webix.confirm({ text: "Accept an incoming call from " + name + " ?", callback });

    });

}

//for convesation function easyrtc.call();
function doCall(easyrtcid) {

  if(!sessionStorage.getItem('room')){
      if (easyrtcid < 0) return false;
//others
      $$("status").setValue("Connecting...")
      easyrtc.call(
          easyrtcid,
          function(caller) {
              $$("endcall").show();
              $$("status").setValue(easyrtc.idToName(caller));

          },
          function(errorMessage) {
              webix.message({
                  type:"error", text:errorMessage
              });
          },
          function(accepted, caller) {
              //rejected commnication
              if (!accepted){
                  webix.message(easyrtc.idToName(caller)+" has rejected your call");
                  $$("status").setValue("");
              }
          }
      );
  }else{

      webix.message({ type:"error", text:"You are Not Admin" });

  }

}

webix.ready(function(){
if(sessionStorage.getItem('room')){
    var pipo = webix.ui({
        rows : [
            { view:"toolbar", cols:[
                    { view:"icon", icon:"university"},
                    { view:"label", label : "Aalto  Video Conference Chatting" },
                    { view:"label", label : "" },
                    { view:"label", label :"Room : "+sessionStorage.getItem('room') },
                    { view:"label", id:"status", css:"status", value:"", width: 200 },
                    { view:"button", id:"GO Home", value:"Salon", width: 120, click:function(){
                            window.location.replace('/Salon.html?name='+getQueryVariable("name"));
                    }},
                    { view:"button", id:"endcall", value:"End Call", width: 100, click:function(){
                            $$("endcall").hide();
                            //Close Convesation
                            easyrtc.hangupAll();
                            $$("contactsList").unselectAll()
                            $$("status").setValue("");

                        }, hidden:true }
                ]},
            { cols :[

                    chat,
                    contactsList


                ]}
        ]
    });

}else{


    var pipo = webix.ui({
        rows : [
            { view:"toolbar", cols:[
                    { view:"icon", icon:"university"},
                    { view:"label", label : "Aalto  Video Conference Chatting" },
                    { view:"label", label : "" },
                    { view:"label", label :"Room : "+getQueryVariable("room") },
                    { view:"label", id:"status", css:"status", value:"", width: 200 },
                    { view:"button", id:"Join", value:"Join",width:80, click:function(){

                            window.location.replace('/Invitation.html?name='+getQueryVariable("name")+'&room='+getQueryVariable("room"));

                    }},
                    { view:"button", id:"Affectation", value:"Affectation ", width: 80, click:function(){

                            window.location.replace('/AffectationAdmin.html?name='+getQueryVariable("name")+'&room='+getQueryVariable("room"));

                        }},
                    { view:"button", id:"GO Home", value:"Home", width: 80, click:function(){

                            window.location.replace('/Salon.html?name='+getQueryVariable("name"));
                    }},
                    { view:"button", id:"endcall", value:"End Call", width: 80, click:function(){
                            $$("endcall").hide();
                            //Close Convesation
                            easyrtc.hangupAll();
                            $$("contactsList").unselectAll()
                            $$("status").setValue("");

                        }, hidden:true },
                    { view:"button", id:"mute", value:"Mute", width: 80, click:function(){

                            easyrtc.enableMicrophone(false);
                    }},
                    { view:"button", id:"Unmute", value:"UnMute", width: 80, click:function(){

                            easyrtc.enableMicrophone(true);
                     }}
                ]},
            { cols :[

                    chat,
                    contactsList,


                ]},
        ]
    });


}


    //My Room
    var Room = webix.ui ({
        view: "window", position:"top", head:"Start Conference", modal:true,
        body: {
            view:"form", rows:[

                { view:"button", value:"Start Admin Room!", click:function(){

                          this.getTopParentView().hide();
                          doConnect(config);


                }}
            ]
        }
    });

    if(getQueryVariable("name")){
        config.name = getQueryVariable("name");
        if(sessionStorage.getItem('room')!=null){
            config.room = sessionStorage.getItem('room');
            doConnect(config);
        }else{
            config.room = getQueryVariable("room");
            Room.show();
        }

    }else{
        window.location.replace('/Salon.html');
    }




});

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}