var Vbox=core.org.voxsoftware.VirtualBox
class DhcpServerList extends Array{
	
	constructor(manager){
		super()
		this.manager= manager
	}

	push(dhcpServer){
		if(!(dhcpServer instanceof Vbox.DhcpServer))
			dhcpServer= new Vbox.DhcpServer(dhcpServer, this)
		dhcpServer.parent= this
		dhcpServer.index= this.length
		super.push(dhcpServer)
	}


	add(dhcpServer){	
		return this.manager.internal_dhcpServers.add(dhcpServer)
	}

	

}

export default DhcpServerList