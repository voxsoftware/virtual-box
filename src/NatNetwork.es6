var Vbox= core.org.voxsoftware.VirtualBox
class NatNetwork extends Vbox.Network{
	
	get IP(){
		return this.info.IP
	}

	get network(){
		return this.info.Network
	}

	get IPv6Enabled(){
		return this.info.IPv6Enabled=="Yes"
	}

	get IPv6Prefix(){
		return this.info.IPv6Prefix
	}

	get DHCPEnabled(){
		return this.info.DHCPEnabled=="Yes"
	}

	get enabled(){
		return this.info.enabled== "Yes"
	}

	get redirectionRules(){
		var ipv4, ipv6, rule
		if(!this.$redirect){
			this.$redirect= new Vbox.RedirectionRuleList(this)
			ipv6= this.info.portForward.ipv6
			for(var i=0;i<ipv6.length;i++){
				this.$redirect.push(ipv6[i])
			}
			ipv4= this.info.portForward.ipv4
			for(var i=0;i<ipv4.length;i++){
				this.$redirect.push(ipv4[i])
			}
		}

		return this.$redirect
	}

	set network(val){
		return this.info.Network=val
	}

	set IPv6Enabled(val){
		return this.info.IPv6Enabled=val
	}

	set IPv6Prefix(val){
		return this.info.IPv6Prefix=val
	}

	set DHCPEnabled(val){
		return this.info.DHCPEnabled=val
	}

	set enabled(val){
		return this.info.enabled=val
	}

	get type(){
		return Vbox.NetworkType.NatNetwork
	}


	async change(){
		var args= []
		//if(this.info.type=="host-only")
			args.push("natnetwork")
		//else
		//	throw new core.System.ArgumentException("No se detectó el tipo de red")

		args.push("ipconfig")
		args.push(this.name)
		args.push("--ip")
		args.push(this.IP)
		args.push("--netmask")
		args.push(this.networkMask)
		await this.manager.command(args)
	}

}
export default NatNetwork