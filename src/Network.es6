var Vbox= core.org.voxsoftware.VirtualBox
class Network{
	
	constructor(info,networks){
		this.info= info
		this.networks=networks
		
	}

	get name(){
		return this.info.NetworkName
	}


	get manager(){
		return this.networks.manager
	}
	

	get IP(){
		
	}

	get type(){
		throw new core.System.NotImplementedException()
	}

	createDhcpServer(){
		return this.manager.__createDhcpServer({
			"networkType": this.type,
			"NetworkName": this.name
		})
	}

	async dhcpServer(){
		var servers= await this.manager.dhcpServers()
		
		for(var i=0;i<servers.length;i++){
			//vw.info(servers[i].networkName, this.name)
			if(servers[i].networkName===this.name)
				return servers[i]
		}

		return null
	}


	get networkName(){
		return this.info.NetworkName
	}


	set IP(val){
		return this.info.IPAddress= val
	}




	async remove(){
		if(this.info.type=="host-only")
			await this.manager.command(["hostonlyif", "remove", this.name])
		else if(this.info.type=="natnetwork")
			await this.manager.command(["natnetwork", "remove", "--netname", this.name])

		else
			throw new core.System.ArgumentException("No se detectó el tipo de red")
	}


	

	

}

export default Network