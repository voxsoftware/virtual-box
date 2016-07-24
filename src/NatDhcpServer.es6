var Vbox= core.org.voxsoftware.VirtualBox
class NatDhcpServer extends Vbox.DhcpServer{
	
	get commandNetName(){
		return "--netname"
	}

}
export default NatDhcpServer