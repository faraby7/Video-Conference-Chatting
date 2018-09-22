var config = {
    server:"/",
    users:function(room, people, me){
        var list = $$("contactsList");
        list.clearAll();
        if (config.name)
            list.add({
                id:-1,
                img:"images/avatar.jpg",
                title: config.name + " ( this is Me )" });
    }
};

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

var chat = {
    css:"absarea",
    template:`<div class='mirrorDiv'><video id='mirrorVideo' width></div> `
};

function funnyName(){
    var first = ["Agile", "Strong", "Tricky", "Shiny", "Gloom"];
    var second = ["Tree", "Cat", "Boss", "User", "Rabbit"];

    return first[Math.floor(Math.random()*first.length)] + " " + second[Math.floor(Math.random()*second.length)];
}

webix.ready(function(){

    webix.ui({
        rows : [
            { view:"toolbar", cols:[
                    { view:"icon", icon:"university"},
                    { view:"label", label : "Aalto  Video Conference Chatting" },
                    { view:"label", label : "" },
                    { view:"icon", icon:"envelope"},
                    { view:"label", id:"Rooom", label:" Waiting Invitation...." },
                    { view:"label", id:"Rooom", label:"Room : Salon" },
                    { view:"label", id:"status", css:"status", value:"", width: 200 },
                    { view:"button", id:"endcall", value:"End Call", width: 100, click:function(){
                            $$("endcall").hide();
                            easyrtc.hangupAll();
                            $$("contactsList").unselectAll()
                            $$("status").setValue("");
                        }, hidden:true }
                ],height:30},
            { cols :[

                    chat,
                    contactsList
                ]}
        ]
    });

    var win = webix.ui ({
        view: "window", position:"top", head:false, modal:true,
        body: {
            view:"form", rows:[
                { view:"text", name:"name", label:"Your name", value:funnyName() },
                { view:"button", value:"Start!", click:function(){
                        var name = this.getFormView().getValues().name;

                        if (!easyrtc.isNameValid (name))
                            webix.message({ type:"error", text:"Invalid name" });
                        else {
                            this.getTopParentView().hide();
                            config.name = name;
                            sessionStorage.setItem("Name", config.name);
                            sessionStorage.setItem("Room", 'default');
                            doConnect(config);
                        }
                    }}
            ]
        }
    });

    if(getQueryVariable("name")){

        console.log(getQueryVariable("name"));
        config.name = getQueryVariable("name");
        doConnect(config);
    }else{
        win.show();
    }

});

function doConnect(config) {

    easyrtc.setVideoDims(640,480);
    easyrtc.setUsername (config.name);
    easyrtc.setRoomOccupantListener(config.users);
    easyrtc.setSocketUrl(config.server);
    easyrtc.easyApp("WebixWebRTC", "mirrorVideo", 0, function(id){
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
        function(caller) {
        var name = easyrtc.idToName(caller);
        console.log(name);
        var callback = function(wasAccepted) {
     //t9oiba dial name m3a room
            window.location.replace('/?name='+getQueryVariable("name"));
            sessionStorage.setItem('room',name);
        };

        if( easyrtc.getConnectionCount() > 0 )
            webix.confirm({ text:"Drop the current call and accept the new one from " + name + " ?", callback });
        else{
            sessionStorage.setItem("Room", name);
            webix.confirm({ title:"Join",type:"confirm-warning",text: "Accept Joining to Room  " + name + " ?", callback });
        }


    });
}

function doCall(easyrtcid) {
    if (easyrtcid < 0) return false;

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
            if (!accepted){
                webix.message(easyrtc.idToName(caller)+" has rejected your call");
                $$("status").setValue("");
            }
        }
    );
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}
