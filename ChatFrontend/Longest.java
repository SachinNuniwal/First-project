public class Longest{

     public static boolean isPalindrome(String str){
        if(str==""||str.length()==1){
            return true;
        }
        int start=0;
        int end=str.length()-1;
        while(start<end){
            if(str.charAt(start++)!=str.charAt(end--)){
                return false;
            }
        }
        return true;
    }

    public static String longest(String old,String nstr){
        if(old==""||old.length()==0){
            return nstr;
        }
        String s=longest(old.substring(1), nstr+old.charAt(0));
        
        String  s2=longest(old.substring(1), nstr.substring(1)+old.charAt(0));
        if(isPalindrome(s)){
            if(isPalindrome(s2)){
                s=s.length()>s2.length()?s:s2;
                return nstr.length()>s.length()?nstr:s;
            }else{
                return nstr.length()>s.length()?nstr:s;
            }
        }else{
            if(isPalindrome(s2)){
                
                return nstr.length()>s2.length()?nstr:s2;
            }else{
                return nstr;
            }
        }
      
    }
    public static void main(String[] args) {
        
        String s="abbba";
        System.out.println(longest(s, ""));
       
    }
}