var Vbox= core.org.voxsoftware.VirtualBox
class HostOnlyDhcpServer extends Vbox.DhcpServer{

	get commandNetName(){
		return "--ifname"
	}


}
export default HostOnlyDhcpServer