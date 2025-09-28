import { useEffect, useState } from "react";
import { Card, CardContent } from "./Card";
import { Badge, Briefcase, Mail, Phone, User } from "lucide-react";

export const UserDetailsCard = ({ userInfo, jobInfo, loading }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setIsVisible(true), 300);
    }
  }, [loading]);

  if (loading) {
    return (
      <Card className="mb-8 overflow-hidden">
        <CardContent className="p-8">
          <div className="animate-pulse">
            <div className="flex items-center space-x-6">
              <div className="rounded-full bg-gradient-to-r from-gray-200 to-gray-300 h-16 w-16 animate-pulse"></div>
              <div className="space-y-3 flex-1">
                <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/3 animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-r from-blue-50/80 to-purple-50/80 border border-blue-200/30 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* User Information */}
          <div className="transform transition-all duration-500 hover:scale-102">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="p-2 bg-blue-100/80 rounded-xl mr-3">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              Candidate Information
            </h3>
            <div className="space-y-3">
              {[
                { icon: User, label: 'Name', value: userInfo?.name || 'Not provided' },
                { icon: Mail, label: 'Email', value: userInfo?.email || 'Not provided' },
                { icon: Phone, label: 'Phone', value: userInfo?.phone || 'Not provided' }
              ].map((item, index) => (
                <div key={index} className={`flex items-center text-sm transform transition-all duration-500 delay-${index * 100}`} style={{ transitionDelay: `${index * 100}ms` }}>
                  <div className="p-1.5 bg-gray-100/80 rounded-lg mr-3">
                    <item.icon className="h-4 w-4 text-gray-500" />
                  </div>
                  <span className="font-medium text-gray-700 min-w-[50px]">{item.label}:</span>
                  <span className="ml-2 text-gray-900 text-xs">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Job Information */}
          <div className="transform transition-all duration-500 hover:scale-102 pt-4 border-t border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="p-2 bg-purple-100/80 rounded-xl mr-3">
                <Briefcase className="h-5 w-5 text-purple-600" />
              </div>
              Applied Position
            </h3>
            <div className="space-y-3">
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <span className="font-medium text-sm text-gray-700">Position:</span>
                <p className="text-gray-900 mt-1 text-base">{jobInfo?.title || 'Senior Frontend Developer'}</p>
              </div>
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <span className="font-medium text-sm text-gray-700">Company:</span>
                <p className="text-gray-900 mt-1 text-sm">{jobInfo?.company || 'TechCorp Inc.'}</p>
              </div>
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <span className="font-medium text-sm text-gray-700">Department:</span>
                <p className="text-gray-900 mt-1 text-sm">{jobInfo?.department || 'Engineering'}</p>
              </div>
              <div className="transform transition-all duration-300 hover:scale-105 inline-block">
                <Badge variant="success">
                  {jobInfo?.status || 'Interview Scheduled'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Job Description */}
          {jobInfo?.description && (
            <div className={`pt-4 border-t border-gray-200/50 transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mr-3"></div>
                Job Description
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed bg-white/50 rounded-xl p-3 backdrop-blur-sm">
                {jobInfo.description}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};