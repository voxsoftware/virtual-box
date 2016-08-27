
var networkType= 
core.System.IEnum.create("org.voxsoftware.VirtualBox.NetworkType",{
	"HostOnly":0,
	"Internal":1,
	"NatNetwork":2,
	"Bridged": 3, 
	"Nat": 4
})


export default networkType