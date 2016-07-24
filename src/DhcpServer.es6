var Vbox= core.org.voxsoftware.VirtualBox
class DhcpServer{
	constructor(info, dhcp){
		this.manager= dhcp?dhcp.manager:null
		this.info= info||{}
	}

	static create(info, dhcp){
	
		if(info.type=="host-only")
			return new Vbox.HostOnlyDhcpServer(info,dhcp)
		else
			return new Vbox.NatDhcpServer(info,dhcp)
	}

	get IP(){
		return this.info.IP
	}

	get name(){
		return this.info.NetworkName
	}

	get lowerIp(){
		return this.info.lowerIPAddress
	}

	get upperIp(){
		return this.info.upperIPAddress
	}

	get enabled(){
		return this.info.Enabled=="Yes"
	}

	get networkMask(){
		return this.info.NetworkMask
	}


	set networkMask(val){
		return this.info.NetworkMask= val
	}


	set IP(val){
		return this.info.IP=val
	}

	set name(val){
		return this.info.NetworkName=val
	}

	set lowerIp(val){
		return this.info.lowerIPAddress=val
	}

	set upperIp(val){
		return this.info.upperIPAddress=val
	}

	




	async addTo(dhcpServers){
		manager= dhcpServers.manager||this.manager
		this.manager= manager

		var args=["dhcpserver", "add", this.commandNetName, this.name]

		args.push("--ip")
		args.push(this.IP)

		args.push("--netmask")
		args.push(this.networkMask)

		args.push("--lowerip")
		args.push(this.lowerIp)

		args.push("--upperip")
		args.push(this.upperIp)		
		vw.log(args)
		await manager.command(args)
	}


	async enable(){
		manager= this.manager
		if(!manager)
			throw new core.System.ArgumentException("Este DhcpServer no ha sido añadido")
	
		var args=["dhcpserver", "add", this.commandNetName, this.name, "--enable"]
		await manager.command(args)
	}

	async disable(){
		manager= this.manager
		if(!manager)
			throw new core.System.ArgumentException("Este DhcpServer no ha sido añadido")
	
		var args=["dhcpserver", "add", this.commandNetName, this.name, "--disable"]
		await manager.command(args)
	}

	async modify(){
		manager= this.manager
		if(!manager)
			throw new core.System.ArgumentException("Este DhcpServer no ha sido añadido")
	
		var args=["dhcpserver", "modify", this.commandNetName, this.name]

		args.push("--ip")
		args.push(this.IP)

		args.push("--netmask")
		args.push(this.networkMask)

		args.push("--lowerip")
		args.push(this.lowerIp)

		args.push("--upperip")
		args.push(this.upperIp)		

		await manager.command(args)
	}

	async remove(){
		var manager= this.manager
		if(!manager)
			throw new core.System.ArgumentException("Este DhcpServer no ha sido añadido")
	
		var args=["dhcpserver", "remove", this.commandNetName, this.name]	
		await manager.command(args)
	}
}
export default DhcpServer