var dataMembre = 0;
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
        height: 100,
        width: 550,
    },
    select:true, scroll:false,
    on:{ onBeforeSelect: (id) => doCall(id) }
};

var config = {

    server:"/",
    users:function(room, people, me){

if(dataMembre == 0){
    var ListeMembres = {};
    var M = [];
    ListeMembres.M = M;

    for (var key in people){
        var v = people[key];

        var id =  v.easyrtcid;
        var title = v.username;
        var membresalon = {
            "id": id,
            "title": title
        }
        ListeMembres.M.push(membresalon);

    }
    dataMembre = ListeMembres;

    var list = $$("contactsList");
    list.clearAll();

    for (var key in people){
        var v = people[key];
        list.add ({
            id: v.easyrtcid,
            img: "images/my_join-green.png",
            title: v.username
        });

    }

}else{
    location.reload();
}}};

var contactsListSalon=0;

function doConnect(config) {

    easyrtc.setVideoDims(640,480);
    easyrtc.setUsername (config.name);
    easyrtc.joinRoom("default",  null, null, null);
    easyrtc.setRoomOccupantListener(config.users);
    easyrtc.setSocketUrl(config.server);
    easyrtc.easyApp("WebixWebRTC", null, 0, function(id){
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

    easyrtc.setAcceptChecker( function(caller, cb) {

        var name = easyrtc.idToName(caller);
        var callback = function(wasAccepted) {
            if( wasAccepted){
                if (easyrtc.getConnectionCount() > 0 )
                    easyrtc.hangupAll();
                $$("endcall").show();
                $$("status").setValue(name);
            }
            cb(wasAccepted);
        };

        if( easyrtc.getConnectionCount() > 0 )
            webix.confirm({ text:"Drop the current call and accept the new one from " + name + " ?", callback });
        else
            webix.confirm({ text: "Accept an incoming call from " + name + " ?", callback });

    });
}


//for convesation function easyrtc.call();
function doCall(easyrtcid) {

    if (easyrtcid < 0) return false;
    $$("status").setValue("Connecting...");

    easyrtc.call(
        easyrtcid,
        getQueryVariable("room"),
        function(errorMessage) {
            webix.message({
                type:"error", text:errorMessage
            });
        },
        function(accepted, caller) {

            if (!accepted){
                webix.message(easyrtc.idToName(caller)+" has rejected your call");
                $$("status").setValue("");
            }
        }
    );
}



function init() {

    config.name =getQueryVariable("room");
    config.room = "default";
    f();
    this.doConnect(config);

}
init();
function f() {
    webix.ready(function () {


        var pipo = webix.ui({
            rows: [
                {
                    view: "toolbar", cols: [
                        { view:"icon", icon:"university"},
                        {view: "label", label: "Aalto  Video Conference Chatting"},
                        {view: "label", id: "Rooom", value: ""},
                        {view: "label", id: "status", css: "status", value: "", width: 200},
                        {
                            view: "button", id: "Return", value: "Return", width: 100, click: function () {
                                window.location.replace('/?name='+getQueryVariable("name")+'&room='+getQueryVariable("room"));
                            }
                        }
                        , {
                            view: "button", id: "GO Home", value: "Home", width: 100, click: function () {
                                window.location.replace('/Salon.html?name='+getQueryVariable("name"));
                            }
                        },
                        {
                            view: "button", id: "endcall", value: "End Call", width: 100, click: function () {
                                $$("endcall").hide();
                                easyrtc.hangupAll();
                                $$("contactsList").unselectAll()
                                $$("status").setValue("");

                            }, hidden: true
                        }
                    ]
                },
                {
                    cols: [
                        contactsList,

                    ]
                }
            ]
        });


    });

}

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