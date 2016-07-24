var Vbox=core.org.voxsoftware.VirtualBox
class RedirectionRuleList extends Array{
	
	constructor(network){
		super()
		this.network= this.network
	}

	push(rule){
		if(!(rule instanceof Vbox.RedirectionRule))
			rule= new Vbox.RedirectionRule(rule, this)
		rule.rules= this
		super.push(rule)
	}


}

export default RedirectionRuleList